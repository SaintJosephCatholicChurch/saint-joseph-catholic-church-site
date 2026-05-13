'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, isValid, parse } from 'date-fns';
import { useState } from 'react';

import { AdminSortableAccordionRepeaterCard } from '../../components/AdminCards';
import { AdminCompactActionBar, AdminStatusStack } from '../../components/AdminWorkspace';
import type { TimesFieldPath, useTimesEditorController } from './useTimesEditorController';

import type { TimesDay } from '../../../interface';

interface TimesEditorWorkspaceProps {
  controller: ReturnType<typeof useTimesEditorController>;
}

function formatTimeValue(value?: string) {
  if (!value) {
    return null;
  }

  try {
    return parse(value, 'h:mm a', new Date());
  } catch {
    return null;
  }
}

function buildCountSummary(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function buildJoinedCountSummary(parts: string[]) {
  if (parts.length === 0) {
    return '0 days';
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

function buildSectionDayNoteSummary(days: TimesDay[] | undefined) {
  const entries = days || [];
  const dayCount = entries.filter((entry) => Boolean(entry.day?.trim())).length;
  const noteCount = entries.length - dayCount;
  const parts: string[] = [];

  if (dayCount > 0) {
    parts.push(buildCountSummary(dayCount, 'day'));
  }

  if (noteCount > 0) {
    parts.push(buildCountSummary(noteCount, 'note'));
  }

  return buildJoinedCountSummary(parts);
}

function formatPickerDraftValue(value: Date | null) {
  if (!value || !isValid(value)) {
    return null;
  }

  return format(value, 'h:mm a');
}

function buildCardDeleteAction(onClick: () => void, label: string) {
  return (
    <IconButton aria-label={label} color="error" onClick={onClick} size="small">
      <DeleteOutlineIcon fontSize="small" />
    </IconButton>
  );
}

function renderBreadcrumbs(
  breadcrumbs: ReturnType<typeof useTimesEditorController>['breadcrumbs'],
  onSelectPath: (path: TimesFieldPath) => void
) {
  const parentBreadcrumbs = breadcrumbs.slice(0, -1);

  return (
    <Box sx={{ alignItems: 'center', color: '#6e5b53', display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {parentBreadcrumbs.map((crumb, index) => {
        const isLast = index === parentBreadcrumbs.length - 1;

        return (
          <Box key={`${crumb.label}-${index}`} sx={{ alignItems: 'center', display: 'flex', gap: 0.75 }}>
            <Link
              component="button"
              type="button"
              underline="hover"
              color="inherit"
              onClick={() => onSelectPath(crumb.path)}
              sx={{ fontSize: '0.9rem', textAlign: 'left' }}
            >
              {crumb.label}
            </Link>
            {!isLast ? <Typography sx={{ color: 'inherit', fontSize: '0.9rem' }}>/</Typography> : null}
          </Box>
        );
      })}
    </Box>
  );
}

export function TimesEditorWorkspace({ controller }: TimesEditorWorkspaceProps) {
  const [deletePath, setDeletePath] = useState<TimesFieldPath | null>(null);

  const activeCategoryId = controller.activePath.kind === 'root' ? null : controller.activePath.categoryId;
  const activeSectionId =
    controller.activePath.kind === 'section' ||
    controller.activePath.kind === 'day' ||
    controller.activePath.kind === 'time' ||
    controller.activePath.kind === 'time-note'
      ? controller.activePath.sectionId
      : null;
  const activeDayId =
    controller.activePath.kind === 'day' ||
    controller.activePath.kind === 'time' ||
    controller.activePath.kind === 'time-note'
      ? controller.activePath.dayId
      : null;
  const activeTimeId =
    controller.activePath.kind === 'time' || controller.activePath.kind === 'time-note'
      ? controller.activePath.timeId
      : null;
  const activeNoteId = controller.activePath.kind === 'time-note' ? controller.activePath.noteId : null;

  function handleDeleteConfirm() {
    if (!deletePath) {
      return;
    }

    switch (deletePath.kind) {
      case 'category':
        controller.removeCategory(deletePath.categoryId);
        break;
      case 'section':
        controller.removeSection(deletePath.categoryId, deletePath.sectionId);
        break;
      case 'day':
        controller.removeDay(deletePath.categoryId, deletePath.sectionId, deletePath.dayId);
        break;
      case 'time':
        controller.removeTime(deletePath.categoryId, deletePath.sectionId, deletePath.dayId, deletePath.timeId);
        break;
      case 'time-note':
        controller.removeTimeNote(
          deletePath.categoryId,
          deletePath.sectionId,
          deletePath.dayId,
          deletePath.timeId,
          deletePath.noteId
        );
        break;
      default:
        break;
    }

    setDeletePath(null);
  }

  function renderCurrentView() {
    if (controller.activePath.kind === 'root') {
      return (
        <Stack spacing={2}>
          <Button variant="contained" onClick={controller.addCategory} sx={{ alignSelf: 'flex-start' }}>
            Add Category
          </Button>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) {
                return;
              }

              const oldIndex = controller.times.findIndex((entry) => entry.id === active.id);
              const newIndex = controller.times.findIndex((entry) => entry.id === over.id);

              if (oldIndex >= 0 && newIndex >= 0) {
                controller.moveCategories(oldIndex, newIndex);
              }
            }}
          >
            <SortableContext
              items={controller.times.map((entry) => entry.id || '')}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1.5}>
                {controller.times.map((category, index) => (
                  <AdminSortableAccordionRepeaterCard
                    key={category.id}
                    id={category.id || `category-${index}`}
                    title={category.name || `Category ${index + 1}`}
                    summary={buildCountSummary(category.sections?.length || 0, 'section')}
                    active={activeCategoryId === category.id}
                    onSummaryClick={() =>
                      controller.setActivePath({ categoryId: category.id || '', field: 'name', kind: 'category' })
                    }
                    summaryActions={buildCardDeleteAction(
                      () => setDeletePath({ categoryId: category.id || '', field: 'name', kind: 'category' }),
                      `Delete ${category.name || 'category'}`
                    )}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      );
    }

    if (controller.activePath.kind === 'category') {
      const category = controller.selection.category;

      if (!category) {
        return null;
      }

      return (
        <Stack spacing={2}>
          <TextField
            label="Category Title"
            value={category.name}
            inputRef={controller.registerField(controller.activePath)}
            onChange={(event) => controller.updateCategoryName(category.id || '', event.target.value)}
            onFocus={() => controller.setActivePath({ categoryId: category.id || '', field: 'name', kind: 'category' })}
            fullWidth
          />
          <AdminCompactActionBar
            actions={
              <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5}>
                <Button variant="outlined" onClick={() => controller.addSection(category.id || '', 'section')}>
                  Add Section
                </Button>
                <Button variant="outlined" onClick={() => controller.addSection(category.id || '', 'note')}>
                  Add Note
                </Button>
              </Stack>
            }
          />
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) {
                return;
              }

              const sections = category.sections || [];
              const oldIndex = sections.findIndex((entry) => entry.id === active.id);
              const newIndex = sections.findIndex((entry) => entry.id === over.id);

              if (oldIndex >= 0 && newIndex >= 0) {
                controller.moveSections(category.id || '', oldIndex, newIndex);
              }
            }}
          >
            <SortableContext
              items={(category.sections || []).map((entry) => entry.id || '')}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1.5}>
                {(category.sections || []).map((section, index) => {
                  const sectionField: 'name' | 'note' = 'note' in section ? 'note' : 'name';
                  const sectionPath: TimesFieldPath = {
                    categoryId: category.id || '',
                    field: sectionField,
                    kind: 'section',
                    sectionId: section.id || ''
                  };

                  return (
                    <AdminSortableAccordionRepeaterCard
                      key={section.id}
                      id={section.id || `section-${index}`}
                      title={'note' in section ? 'Section Note' : section.name || `Section ${index + 1}`}
                      summary={'note' in section ? section.note || 'Note' : buildSectionDayNoteSummary(section.days)}
                      active={activeSectionId === section.id}
                      onSummaryClick={() => controller.setActivePath(sectionPath)}
                      summaryActions={buildCardDeleteAction(
                        () => setDeletePath(sectionPath),
                        `Delete ${'note' in section ? 'section note' : section.name || 'section'}`
                      )}
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      );
    }

    if (controller.activePath.kind === 'section') {
      const section = controller.selection.section;
      const categoryId = controller.activePath.categoryId;

      if (!section) {
        return null;
      }

      if ('note' in section) {
        return (
          <Stack spacing={2}>
            <AdminCompactActionBar
              actions={buildCardDeleteAction(
                () => setDeletePath(controller.activePath),
                `Delete ${controller.describePath(controller.activePath)}`
              )}
            />
            <TextField
              label="Section Note"
              value={section.note}
              inputRef={controller.registerField(controller.activePath)}
              onChange={(event) =>
                controller.updateSectionField(categoryId, section.id || '', 'note', event.target.value)
              }
              onFocus={() => controller.setActivePath(controller.activePath)}
              fullWidth
              multiline
              minRows={5}
            />
          </Stack>
        );
      }

      return (
        <Stack spacing={2}>
          <TextField
            label="Section Title"
            value={section.name}
            inputRef={controller.registerField(controller.activePath)}
            onChange={(event) =>
              controller.updateSectionField(categoryId, section.id || '', 'name', event.target.value)
            }
            onFocus={() => controller.setActivePath(controller.activePath)}
            fullWidth
          />
          <AdminCompactActionBar
            actions={
              <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5}>
                <Button variant="outlined" onClick={() => controller.addDay(categoryId, section.id || '')}>
                  Add Day / Line
                </Button>
                {buildCardDeleteAction(
                  () => setDeletePath(controller.activePath),
                  `Delete ${controller.describePath(controller.activePath)}`
                )}
              </Stack>
            }
          />
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) {
                return;
              }

              const days = section.days || [];
              const oldIndex = days.findIndex((entry) => entry.id === active.id);
              const newIndex = days.findIndex((entry) => entry.id === over.id);

              if (oldIndex >= 0 && newIndex >= 0) {
                controller.moveDays(categoryId, section.id || '', oldIndex, newIndex);
              }
            }}
          >
            <SortableContext
              items={(section.days || []).map((entry) => entry.id || '')}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1.5}>
                {(section.days || []).map((day, index) => {
                  const dayPath = {
                    categoryId,
                    dayId: day.id || '',
                    field: 'day' as const,
                    kind: 'day' as const,
                    sectionId: section.id || ''
                  };

                  return (
                    <AdminSortableAccordionRepeaterCard
                      key={day.id}
                      id={day.id || `day-${index}`}
                      title={day.day || `Day / Line ${index + 1}`}
                      summary={buildCountSummary(day.times?.length || 0, 'time')}
                      active={activeDayId === day.id}
                      onSummaryClick={() => controller.setActivePath(dayPath)}
                      summaryActions={buildCardDeleteAction(
                        () => setDeletePath(dayPath),
                        `Delete ${day.day || 'day / line'}`
                      )}
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      );
    }

    if (controller.activePath.kind === 'day') {
      const day = controller.selection.day;
      const { categoryId, sectionId } = controller.activePath;

      if (!day) {
        return null;
      }

      return (
        <Stack spacing={2}>
          <TextField
            label="Day / Line Title"
            value={day.day}
            inputRef={controller.registerField(controller.activePath)}
            onChange={(event) => controller.updateDayTitle(categoryId, sectionId, day.id || '', event.target.value)}
            onFocus={() => controller.setActivePath(controller.activePath)}
            fullWidth
          />
          <AdminCompactActionBar
            actions={
              <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5}>
                <Button variant="outlined" onClick={() => controller.addTime(categoryId, sectionId, day.id || '')}>
                  Add Time
                </Button>
                {buildCardDeleteAction(
                  () => setDeletePath(controller.activePath),
                  `Delete ${controller.describePath(controller.activePath)}`
                )}
              </Stack>
            }
          />
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) {
                return;
              }

              const timesForDay = day.times || [];
              const oldIndex = timesForDay.findIndex((entry) => entry.id === active.id);
              const newIndex = timesForDay.findIndex((entry) => entry.id === over.id);

              if (oldIndex >= 0 && newIndex >= 0) {
                controller.moveTimes(categoryId, sectionId, day.id || '', oldIndex, newIndex);
              }
            }}
          >
            <SortableContext
              items={(day.times || []).map((entry) => entry.id || '')}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1.5}>
                {(day.times || []).map((time, index) => {
                  const timePath = {
                    categoryId,
                    dayId: day.id || '',
                    field: 'time' as const,
                    kind: 'time' as const,
                    sectionId,
                    timeId: time.id || ''
                  };

                  return (
                    <AdminSortableAccordionRepeaterCard
                      key={time.id}
                      id={time.id || `time-${index}`}
                      title={controller.describePath(timePath)}
                      summary={buildCountSummary(time.notes?.length || 0, 'note')}
                      active={activeTimeId === time.id}
                      onSummaryClick={() => controller.setActivePath(timePath)}
                      summaryActions={buildCardDeleteAction(
                        () => setDeletePath(timePath),
                        `Delete ${controller.describePath(timePath)}`
                      )}
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      );
    }

    if (controller.activePath.kind === 'time') {
      const time = controller.selection.time;
      const timePath = controller.activePath;
      const { categoryId, dayId, sectionId, timeId } = timePath;

      if (!time) {
        return null;
      }

      return (
        <Stack spacing={2}>
          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2}>
            <TimePicker
              enableAccessibleFieldDOMStructure={false}
              inputRef={controller.registerField({ ...timePath, field: 'time' })}
              label="Start Time"
              value={formatTimeValue(time.time)}
              onChange={(nextValue) => {
                const nextFormattedValue = formatPickerDraftValue(nextValue);

                if (nextValue && nextFormattedValue === null) {
                  return;
                }

                controller.updateTimeField(categoryId, sectionId, dayId, timeId, 'time', nextFormattedValue || '');
              }}
              slotProps={{
                desktopPaper: {
                  sx: {
                    backgroundColor: '#fffaf4',
                    backgroundImage: 'none',
                    opacity: 1
                  }
                },
                field: {
                  onFocus: () => controller.setActivePath({ ...timePath, field: 'time' })
                },
                mobilePaper: {
                  sx: {
                    backgroundColor: '#fffaf4',
                    backgroundImage: 'none',
                    opacity: 1
                  }
                },
                textField: {
                  fullWidth: true
                }
              }}
              format="h:mm a"
              ampm
            />
            <TimePicker
              enableAccessibleFieldDOMStructure={false}
              inputRef={controller.registerField({ ...timePath, field: 'end_time' })}
              label="End Time"
              value={formatTimeValue(time.end_time)}
              onChange={(nextValue) => {
                const nextFormattedValue = formatPickerDraftValue(nextValue);

                if (nextValue && nextFormattedValue === null) {
                  return;
                }

                controller.updateTimeField(categoryId, sectionId, dayId, timeId, 'end_time', nextFormattedValue || '');
              }}
              slotProps={{
                desktopPaper: {
                  sx: {
                    backgroundColor: '#fffaf4',
                    backgroundImage: 'none',
                    opacity: 1
                  }
                },
                field: {
                  onFocus: () => controller.setActivePath({ ...timePath, field: 'end_time' })
                },
                mobilePaper: {
                  sx: {
                    backgroundColor: '#fffaf4',
                    backgroundImage: 'none',
                    opacity: 1
                  }
                },
                textField: {
                  fullWidth: true
                }
              }}
              format="h:mm a"
              ampm
            />
          </Stack>
          <AdminCompactActionBar
            actions={
              <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5}>
                <Button variant="outlined" onClick={() => controller.addTimeNote(categoryId, sectionId, dayId, timeId)}>
                  Add Note
                </Button>
                {buildCardDeleteAction(
                  () => setDeletePath(controller.activePath),
                  `Delete ${controller.describePath(controller.activePath)}`
                )}
              </Stack>
            }
          />
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) {
                return;
              }

              const notes = time.notes || [];
              const oldIndex = notes.findIndex((entry) => entry.id === active.id);
              const newIndex = notes.findIndex((entry) => entry.id === over.id);

              if (oldIndex >= 0 && newIndex >= 0) {
                controller.moveNotes(categoryId, sectionId, dayId, timeId, oldIndex, newIndex);
              }
            }}
          >
            <SortableContext
              items={(time.notes || []).map((entry) => entry.id || '')}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1.5}>
                {(time.notes || []).map((note, index) => {
                  const notePath = {
                    categoryId,
                    dayId,
                    field: 'note' as const,
                    kind: 'time-note' as const,
                    noteId: note.id || '',
                    sectionId,
                    timeId
                  };

                  return (
                    <AdminSortableAccordionRepeaterCard
                      key={note.id}
                      id={note.id || `note-${index}`}
                      title={note.note?.trim() || `Note ${index + 1}`}
                      summary="Open note editor"
                      active={activeNoteId === note.id}
                      onSummaryClick={() => controller.setActivePath(notePath)}
                      summaryActions={buildCardDeleteAction(() => setDeletePath(notePath), `Delete note ${index + 1}`)}
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      );
    }

    const note = controller.selection.note;
    const notePath = controller.activePath.kind === 'time-note' ? controller.activePath : null;

    if (!note || !notePath) {
      return null;
    }

    return (
      <Stack spacing={2}>
        <AdminCompactActionBar
          actions={buildCardDeleteAction(
            () => setDeletePath(controller.activePath),
            `Delete ${controller.describePath(controller.activePath)}`
          )}
        />
        <TextField
          label="Time Note"
          value={note.note || ''}
          inputRef={controller.registerField(controller.activePath)}
          onChange={(event) =>
            controller.updateTimeNote(
              notePath.categoryId,
              notePath.sectionId,
              notePath.dayId,
              notePath.timeId,
              notePath.noteId,
              event.target.value
            )
          }
          onFocus={() => controller.setActivePath(notePath)}
          fullWidth
          multiline
          minRows={4}
        />
      </Stack>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {controller.breadcrumbs.length > 1 ? renderBreadcrumbs(controller.breadcrumbs, controller.setActivePath) : null}
        <AdminStatusStack>{renderCurrentView()}</AdminStatusStack>

        {deletePath ? (
          <Dialog open onClose={() => setDeletePath(null)}>
            <DialogTitle>Delete {controller.describePath(deletePath)}?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete {controller.describePath(deletePath)}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeletePath(null)} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </Stack>
    </LocalizationProvider>
  );
}
