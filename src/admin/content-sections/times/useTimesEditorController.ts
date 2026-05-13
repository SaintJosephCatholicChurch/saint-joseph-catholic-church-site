'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useAdminFieldSelection } from '../components/adminPreviewSelection';
import { arrayMoveImmutable } from '../../../util/array.util';

import type { Times, TimesNoteSection, TimesSection, TimesTime } from '../../../interface';

type RecordDetailPanelId = 'editor' | 'preview';

export type TimesFieldPath =
  | { kind: 'root' }
  | { categoryId: string; field: 'name'; kind: 'category' }
  | { categoryId: string; field: 'name' | 'note'; kind: 'section'; sectionId: string }
  | { categoryId: string; dayId: string; field: 'day'; kind: 'day'; sectionId: string }
  | { categoryId: string; dayId: string; field: 'end_time' | 'time'; kind: 'time'; sectionId: string; timeId: string }
  | {
      categoryId: string;
      dayId: string;
      field: 'note';
      kind: 'time-note';
      noteId: string;
      sectionId: string;
      timeId: string;
    };

export interface TimesBreadcrumb {
  label: string;
  path: TimesFieldPath;
}

interface MutableTimesTimeNote {
  id: string | undefined;
  note?: string;
}

interface MutableTimesTime {
  end_time?: string;
  id: string | undefined;
  notes?: MutableTimesTimeNote[];
  time?: string;
}

interface MutableTimesDay {
  day: string;
  id: string | undefined;
  times?: MutableTimesTime[];
}

interface MutableTimesSection {
  days?: MutableTimesDay[];
  id: string | undefined;
  name: string;
}

interface MutableTimesNoteSection {
  id: string | undefined;
  note: string;
}

type MutableTimesSectionValue = MutableTimesSection | MutableTimesNoteSection;

interface MutableTimesCategory {
  id: string | undefined;
  name: string;
  sections?: MutableTimesSectionValue[];
}

interface TimesResolvedSelection {
  category?: MutableTimesCategory;
  categoryIndex: number;
  day?: MutableTimesDay;
  dayIndex: number;
  note?: MutableTimesTimeNote;
  noteIndex: number;
  section?: MutableTimesSectionValue;
  sectionIndex: number;
  time?: MutableTimesTime;
  timeIndex: number;
}

interface TimesEditorControllerOptions {
  onChange: (times: Times[]) => void;
  times: Times[];
}

interface SetActivePathOptions {
  focus?: boolean;
}

function cloneTimes(times: Times[]) {
  return structuredClone(times) as MutableTimesCategory[];
}

function isNoteSection(
  section: MutableTimesSectionValue | TimesSection | TimesNoteSection
): section is MutableTimesNoteSection {
  return 'note' in section;
}

function createEmptyCategory(): MutableTimesCategory {
  return { id: uuid(), name: 'New Category', sections: [] };
}

function createEmptySection(): MutableTimesSection {
  return { days: [], id: uuid(), name: 'New Section' };
}

function createEmptySectionNote(): MutableTimesNoteSection {
  return { id: uuid(), note: 'New Note' };
}

function createEmptyDay(): MutableTimesDay {
  return { day: 'New Day / Line', id: uuid(), times: [] };
}

function createEmptyTime(): MutableTimesTime {
  return { end_time: '', id: uuid(), notes: [], time: '' };
}

function createEmptyTimeNote(): MutableTimesTimeNote {
  return { id: uuid(), note: '' };
}

function normalizeTimesIds(input: Times[]): Times[] {
  let changed = false;

  const normalized = input.map((category) => ({
    ...category,
    id:
      category.id ??
      (() => {
        changed = true;
        return uuid();
      })(),
    sections: (category.sections || []).map((section) => {
      if ('note' in section) {
        return {
          ...section,
          id:
            section.id ??
            (() => {
              changed = true;
              return uuid();
            })()
        };
      }

      return {
        ...section,
        days: (section.days || []).map((day) => ({
          ...day,
          id:
            day.id ??
            (() => {
              changed = true;
              return uuid();
            })(),
          times: (day.times || []).map((time) => ({
            ...time,
            id:
              time.id ??
              (() => {
                changed = true;
                return uuid();
              })(),
            notes: (time.notes || []).map((note) => ({
              ...note,
              id:
                note.id ??
                (() => {
                  changed = true;
                  return uuid();
                })()
            }))
          }))
        })),
        id:
          section.id ??
          (() => {
            changed = true;
            return uuid();
          })()
      };
    })
  }));

  return changed ? normalized : input;
}

export function encodeTimesFieldPath(path: TimesFieldPath) {
  switch (path.kind) {
    case 'root':
      return 'root';
    case 'category':
      return ['category', path.categoryId, path.field].join('|');
    case 'section':
      return ['section', path.categoryId, path.sectionId, path.field].join('|');
    case 'day':
      return ['day', path.categoryId, path.sectionId, path.dayId, path.field].join('|');
    case 'time':
      return ['time', path.categoryId, path.sectionId, path.dayId, path.timeId, path.field].join('|');
    case 'time-note':
      return ['time-note', path.categoryId, path.sectionId, path.dayId, path.timeId, path.noteId, path.field].join('|');
    default:
      return 'root';
  }
}

export function decodeTimesFieldPath(pathKey: string): TimesFieldPath | null {
  const parts = pathKey.split('|');

  switch (parts[0]) {
    case 'root':
      return { kind: 'root' };
    case 'category':
      return parts.length === 3 && parts[2] === 'name'
        ? { categoryId: parts[1], field: 'name', kind: 'category' }
        : null;
    case 'section':
      return parts.length === 4 && (parts[3] === 'name' || parts[3] === 'note')
        ? { categoryId: parts[1], field: parts[3], kind: 'section', sectionId: parts[2] }
        : null;
    case 'day':
      return parts.length === 5 && parts[4] === 'day'
        ? { categoryId: parts[1], dayId: parts[3], field: 'day', kind: 'day', sectionId: parts[2] }
        : null;
    case 'time':
      return parts.length === 6 && (parts[5] === 'time' || parts[5] === 'end_time')
        ? {
            categoryId: parts[1],
            dayId: parts[3],
            field: parts[5],
            kind: 'time',
            sectionId: parts[2],
            timeId: parts[4]
          }
        : null;
    case 'time-note':
      return parts.length === 7 && parts[6] === 'note'
        ? {
            categoryId: parts[1],
            dayId: parts[3],
            field: 'note',
            kind: 'time-note',
            noteId: parts[5],
            sectionId: parts[2],
            timeId: parts[4]
          }
        : null;
    default:
      return null;
  }
}

function resolveSelection(times: Times[], path: TimesFieldPath): TimesResolvedSelection {
  if (path.kind === 'root') {
    return { categoryIndex: -1, dayIndex: -1, noteIndex: -1, sectionIndex: -1, timeIndex: -1 };
  }

  const categories = times as MutableTimesCategory[];
  const categoryIndex = categories.findIndex((category) => category.id === path.categoryId);
  const category = categoryIndex >= 0 ? categories[categoryIndex] : undefined;

  if (!category) {
    return { categoryIndex: -1, dayIndex: -1, noteIndex: -1, sectionIndex: -1, timeIndex: -1 };
  }

  if (path.kind === 'category') {
    return { category, categoryIndex, dayIndex: -1, noteIndex: -1, sectionIndex: -1, timeIndex: -1 };
  }

  const sections = category.sections || [];
  const sectionIndex = sections.findIndex((section) => section.id === path.sectionId);
  const section = sectionIndex >= 0 ? sections[sectionIndex] : undefined;

  if (!section) {
    return { category, categoryIndex, dayIndex: -1, noteIndex: -1, sectionIndex: -1, timeIndex: -1 };
  }

  if (path.kind === 'section') {
    return { category, categoryIndex, dayIndex: -1, noteIndex: -1, section, sectionIndex, timeIndex: -1 };
  }

  if (isNoteSection(section)) {
    return { category, categoryIndex, dayIndex: -1, noteIndex: -1, section, sectionIndex, timeIndex: -1 };
  }

  const days = section.days || [];
  const dayIndex = days.findIndex((day) => day.id === path.dayId);
  const day = dayIndex >= 0 ? days[dayIndex] : undefined;

  if (!day) {
    return { category, categoryIndex, dayIndex: -1, noteIndex: -1, section, sectionIndex, timeIndex: -1 };
  }

  if (path.kind === 'day') {
    return { category, categoryIndex, day, dayIndex, noteIndex: -1, section, sectionIndex, timeIndex: -1 };
  }

  const timesByDay = day.times || [];
  const timeIndex = timesByDay.findIndex((time) => time.id === path.timeId);
  const time = timeIndex >= 0 ? timesByDay[timeIndex] : undefined;

  if (!time) {
    return { category, categoryIndex, day, dayIndex, noteIndex: -1, section, sectionIndex, timeIndex: -1 };
  }

  if (path.kind === 'time') {
    return { category, categoryIndex, day, dayIndex, noteIndex: -1, section, sectionIndex, time, timeIndex };
  }

  const notes = time.notes || [];
  const noteIndex = notes.findIndex((note) => note.id === path.noteId);
  const note = noteIndex >= 0 ? notes[noteIndex] : undefined;

  return { category, categoryIndex, day, dayIndex, note, noteIndex, section, sectionIndex, time, timeIndex };
}

function getDefaultPath(times: Times[]): TimesFieldPath {
  return times.length > 0 ? { categoryId: times[0].id || '', field: 'name', kind: 'category' } : { kind: 'root' };
}

function pathExists(times: Times[], path: TimesFieldPath) {
  if (path.kind === 'root') {
    return true;
  }

  const selection = resolveSelection(times, path);

  switch (path.kind) {
    case 'category':
      return Boolean(selection.category);
    case 'section':
      return Boolean(selection.category && selection.section);
    case 'day':
      return Boolean(selection.category && selection.section && selection.day);
    case 'time':
      return Boolean(selection.category && selection.section && selection.day && selection.time);
    case 'time-note':
      return Boolean(selection.category && selection.section && selection.day && selection.time && selection.note);
    default:
      return false;
  }
}

function getParentPath(path: TimesFieldPath): TimesFieldPath {
  switch (path.kind) {
    case 'root':
      return { kind: 'root' };
    case 'category':
      return { kind: 'root' };
    case 'section':
      return { categoryId: path.categoryId, field: 'name', kind: 'category' };
    case 'day':
      return { categoryId: path.categoryId, field: 'name', kind: 'section', sectionId: path.sectionId };
    case 'time':
      return { categoryId: path.categoryId, dayId: path.dayId, field: 'day', kind: 'day', sectionId: path.sectionId };
    case 'time-note':
      return {
        categoryId: path.categoryId,
        dayId: path.dayId,
        field: 'time',
        kind: 'time',
        sectionId: path.sectionId,
        timeId: path.timeId
      };
    default:
      return { kind: 'root' };
  }
}

function getTimeSummary(time: MutableTimesTime | TimesTime | undefined) {
  if (!time) {
    return 'Time';
  }

  if (time.time && time.end_time) {
    return `${time.time} - ${time.end_time}`;
  }

  if (time.time) {
    return time.time;
  }

  if (time.end_time) {
    return time.end_time;
  }

  return 'Times';
}

function getSectionSummary(section: MutableTimesSectionValue | undefined) {
  if (!section) {
    return 'Section';
  }

  if (isNoteSection(section)) {
    return section.note.trim() || 'Note';
  }

  return section.name.trim() || 'Section';
}

function getBreadcrumbs(times: Times[], path: TimesFieldPath): TimesBreadcrumb[] {
  if (path.kind === 'root') {
    return [{ label: 'Categories', path }];
  }

  const selection = resolveSelection(times, path);
  const breadcrumbs: TimesBreadcrumb[] = [{ label: 'Categories', path: { kind: 'root' } }];

  if (selection.category) {
    breadcrumbs.push({
      label: selection.category.name.trim() || 'Untitled category',
      path: { categoryId: selection.category.id || '', field: 'name', kind: 'category' }
    });
  }

  if (selection.section) {
    breadcrumbs.push({
      label: getSectionSummary(selection.section),
      path: {
        categoryId: path.categoryId,
        field: isNoteSection(selection.section) ? 'note' : 'name',
        kind: 'section',
        sectionId: selection.section.id || ''
      }
    });
  }

  if (selection.day) {
    breadcrumbs.push({
      label: selection.day.day.trim() || 'Untitled day',
      path: {
        categoryId: path.categoryId,
        dayId: selection.day.id || '',
        field: 'day',
        kind: 'day',
        sectionId: selection.section?.id || ''
      }
    });
  }

  if (selection.time) {
    breadcrumbs.push({
      label: getTimeSummary(selection.time),
      path: {
        categoryId: path.categoryId,
        dayId: selection.day?.id || '',
        field: 'time',
        kind: 'time',
        sectionId: selection.section?.id || '',
        timeId: selection.time.id || ''
      }
    });
  }

  if (selection.note) {
    breadcrumbs.push({
      label: selection.note.note?.trim() || 'Time note',
      path: {
        categoryId: path.categoryId,
        dayId: selection.day?.id || '',
        field: 'note',
        kind: 'time-note',
        noteId: selection.note.id || '',
        sectionId: selection.section?.id || '',
        timeId: selection.time?.id || ''
      }
    });
  }

  return breadcrumbs;
}

export function useTimesEditorController({ onChange, times }: TimesEditorControllerOptions) {
  const normalizedTimes = useMemo(() => normalizeTimesIds(times), [times]);
  const [activePath, setActivePathState] = useState<TimesFieldPath>(() => getDefaultPath(normalizedTimes));
  const [detailPanel, setDetailPanel] = useState<RecordDetailPanelId>('editor');
  const fieldSelection = useAdminFieldSelection<string>();

  useEffect(() => {
    if (normalizedTimes !== times) {
      onChange(normalizedTimes);
    }
  }, [normalizedTimes, onChange, times]);

  useEffect(() => {
    if (!pathExists(normalizedTimes, activePath)) {
      setActivePathState(getDefaultPath(normalizedTimes));
    }
  }, [activePath, normalizedTimes]);

  const activePathKey = useMemo(() => encodeTimesFieldPath(activePath), [activePath]);
  const selection = useMemo(() => resolveSelection(normalizedTimes, activePath), [activePath, normalizedTimes]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(normalizedTimes, activePath), [activePath, normalizedTimes]);

  const requestFocus = useCallback(
    (path: TimesFieldPath) => {
      fieldSelection.selectFieldKey(encodeTimesFieldPath(path), { focus: true });
    },
    [fieldSelection]
  );

  const registerField = useCallback(
    (path: TimesFieldPath) => fieldSelection.registerField(encodeTimesFieldPath(path)),
    [fieldSelection]
  );

  const setActivePath = useCallback(
    (path: TimesFieldPath, options?: SetActivePathOptions) => {
      setActivePathState(path);

      if (options?.focus) {
        requestFocus(path);
      }
    },
    [requestFocus]
  );

  const selectPathKey = useCallback(
    (pathKey: string) => {
      const decodedPath = decodeTimesFieldPath(pathKey);

      if (!decodedPath || !pathExists(normalizedTimes, decodedPath)) {
        return;
      }

      setActivePath(decodedPath, { focus: true });
    },
    [normalizedTimes, setActivePath]
  );

  const commitTimes = useCallback(
    (nextTimes: MutableTimesCategory[], nextPath?: TimesFieldPath, options?: SetActivePathOptions) => {
      onChange(nextTimes);

      if (nextPath) {
        setActivePath(nextPath, options);
      }
    },
    [onChange, setActivePath]
  );

  const moveCategories = useCallback(
    (oldIndex: number, newIndex: number) => {
      const nextTimes = arrayMoveImmutable(cloneTimes(normalizedTimes), oldIndex, newIndex);
      commitTimes(nextTimes, activePath);
    },
    [activePath, commitTimes, normalizedTimes]
  );

  const addCategory = useCallback(() => {
    const nextTimes = cloneTimes(normalizedTimes);
    const nextCategory = createEmptyCategory();
    nextTimes.push(nextCategory);
    commitTimes(nextTimes, { categoryId: nextCategory.id || '', field: 'name', kind: 'category' }, { focus: true });
  }, [commitTimes, normalizedTimes]);

  const updateCategoryName = useCallback(
    (categoryId: string, name: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);

      if (!category) {
        return;
      }

      category.name = name;
      commitTimes(nextTimes, { categoryId, field: 'name', kind: 'category' });
    },
    [commitTimes, normalizedTimes]
  );

  const removeCategory = useCallback(
    (categoryId: string) => {
      const nextTimes = cloneTimes(normalizedTimes).filter((entry) => entry.id !== categoryId);
      commitTimes(
        nextTimes,
        nextTimes.length > 0 ? { categoryId: nextTimes[0].id || '', field: 'name', kind: 'category' } : { kind: 'root' }
      );
    },
    [commitTimes, normalizedTimes]
  );

  const moveSections = useCallback(
    (categoryId: string, oldIndex: number, newIndex: number) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);

      if (!category) {
        return;
      }

      category.sections = arrayMoveImmutable(category.sections || [], oldIndex, newIndex);
      commitTimes(nextTimes, activePath);
    },
    [activePath, commitTimes, normalizedTimes]
  );

  const addSection = useCallback(
    (categoryId: string, mode: 'note' | 'section') => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);

      if (!category) {
        return;
      }

      const nextSection = mode === 'note' ? createEmptySectionNote() : createEmptySection();
      category.sections = [...(category.sections || []), nextSection];
      commitTimes(
        nextTimes,
        {
          categoryId,
          field: mode === 'note' ? 'note' : 'name',
          kind: 'section',
          sectionId: nextSection.id || ''
        },
        { focus: true }
      );
    },
    [commitTimes, normalizedTimes]
  );

  const updateSectionField = useCallback(
    (categoryId: string, sectionId: string, field: 'name' | 'note', value: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section) {
        return;
      }

      if (field === 'note' && isNoteSection(section)) {
        section.note = value;
      }

      if (field === 'name' && !isNoteSection(section)) {
        section.name = value;
      }

      commitTimes(nextTimes, { categoryId, field, kind: 'section', sectionId });
    },
    [commitTimes, normalizedTimes]
  );

  const removeSection = useCallback(
    (categoryId: string, sectionId: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);

      if (!category) {
        return;
      }

      category.sections = (category.sections || []).filter((entry) => entry.id !== sectionId);
      commitTimes(nextTimes, { categoryId, field: 'name', kind: 'category' });
    },
    [commitTimes, normalizedTimes]
  );

  const moveDays = useCallback(
    (categoryId: string, sectionId: string, oldIndex: number, newIndex: number) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      section.days = arrayMoveImmutable(section.days || [], oldIndex, newIndex);
      commitTimes(nextTimes, activePath);
    },
    [activePath, commitTimes, normalizedTimes]
  );

  const addDay = useCallback(
    (categoryId: string, sectionId: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const nextDay = createEmptyDay();
      section.days = [...(section.days || []), nextDay];
      commitTimes(
        nextTimes,
        { categoryId, dayId: nextDay.id || '', field: 'day', kind: 'day', sectionId },
        { focus: true }
      );
    },
    [commitTimes, normalizedTimes]
  );

  const updateDayTitle = useCallback(
    (categoryId: string, sectionId: string, dayId: string, value: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      if (!day) {
        return;
      }

      day.day = value;
      commitTimes(nextTimes, { categoryId, dayId, field: 'day', kind: 'day', sectionId });
    },
    [commitTimes, normalizedTimes]
  );

  const removeDay = useCallback(
    (categoryId: string, sectionId: string, dayId: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      section.days = (section.days || []).filter((entry) => entry.id !== dayId);
      commitTimes(nextTimes, { categoryId, field: 'name', kind: 'section', sectionId });
    },
    [commitTimes, normalizedTimes]
  );

  const moveTimes = useCallback(
    (categoryId: string, sectionId: string, dayId: string, oldIndex: number, newIndex: number) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      if (!day) {
        return;
      }

      day.times = arrayMoveImmutable(day.times || [], oldIndex, newIndex);
      commitTimes(nextTimes, activePath);
    },
    [activePath, commitTimes, normalizedTimes]
  );

  const addTime = useCallback(
    (categoryId: string, sectionId: string, dayId: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      if (!day) {
        return;
      }

      const nextTime = createEmptyTime();
      day.times = [...(day.times || []), nextTime];
      commitTimes(
        nextTimes,
        { categoryId, dayId, field: 'time', kind: 'time', sectionId, timeId: nextTime.id || '' },
        { focus: true }
      );
    },
    [commitTimes, normalizedTimes]
  );

  const updateTimeField = useCallback(
    (
      categoryId: string,
      sectionId: string,
      dayId: string,
      timeId: string,
      field: 'end_time' | 'time',
      value: string
    ) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      const time = day?.times?.find((entry) => entry.id === timeId);

      if (!day || !time) {
        return;
      }

      time[field] = value;
      commitTimes(nextTimes, { categoryId, dayId, field, kind: 'time', sectionId, timeId });
    },
    [commitTimes, normalizedTimes]
  );

  const removeTime = useCallback(
    (categoryId: string, sectionId: string, dayId: string, timeId: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      if (!day) {
        return;
      }

      day.times = (day.times || []).filter((entry) => entry.id !== timeId);
      commitTimes(nextTimes, { categoryId, dayId, field: 'day', kind: 'day', sectionId });
    },
    [commitTimes, normalizedTimes]
  );

  const moveNotes = useCallback(
    (categoryId: string, sectionId: string, dayId: string, timeId: string, oldIndex: number, newIndex: number) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      const time = day?.times?.find((entry) => entry.id === timeId);

      if (!day || !time) {
        return;
      }

      time.notes = arrayMoveImmutable(time.notes || [], oldIndex, newIndex);
      commitTimes(nextTimes, activePath);
    },
    [activePath, commitTimes, normalizedTimes]
  );

  const addTimeNote = useCallback(
    (categoryId: string, sectionId: string, dayId: string, timeId: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      const time = day?.times?.find((entry) => entry.id === timeId);

      if (!day || !time) {
        return;
      }

      const nextNote = createEmptyTimeNote();
      time.notes = [...(time.notes || []), nextNote];
      commitTimes(
        nextTimes,
        { categoryId, dayId, field: 'note', kind: 'time-note', noteId: nextNote.id || '', sectionId, timeId },
        { focus: true }
      );
    },
    [commitTimes, normalizedTimes]
  );

  const updateTimeNote = useCallback(
    (categoryId: string, sectionId: string, dayId: string, timeId: string, noteId: string, value: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      const time = day?.times?.find((entry) => entry.id === timeId);
      const note = time?.notes?.find((entry) => entry.id === noteId);

      if (!day || !time || !note) {
        return;
      }

      note.note = value;
      commitTimes(nextTimes, { categoryId, dayId, field: 'note', kind: 'time-note', noteId, sectionId, timeId });
    },
    [commitTimes, normalizedTimes]
  );

  const removeTimeNote = useCallback(
    (categoryId: string, sectionId: string, dayId: string, timeId: string, noteId: string) => {
      const nextTimes = cloneTimes(normalizedTimes);
      const category = nextTimes.find((entry) => entry.id === categoryId);
      const section = category?.sections?.find((entry) => entry.id === sectionId);

      if (!category || !section || isNoteSection(section)) {
        return;
      }

      const day = (section.days || []).find((entry) => entry.id === dayId);
      const time = day?.times?.find((entry) => entry.id === timeId);

      if (!day || !time) {
        return;
      }

      time.notes = (time.notes || []).filter((entry) => entry.id !== noteId);
      commitTimes(nextTimes, { categoryId, dayId, field: 'time', kind: 'time', sectionId, timeId });
    },
    [commitTimes, normalizedTimes]
  );

  const goBack = useCallback(() => {
    setActivePath(getParentPath(activePath));
  }, [activePath, setActivePath]);

  const describePath = useCallback(
    (path: TimesFieldPath) => {
      if (path.kind === 'root') {
        return 'category';
      }

      const resolvedSelection = resolveSelection(normalizedTimes, path);

      switch (path.kind) {
        case 'category':
          return resolvedSelection.category?.name?.trim() || 'category';
        case 'section':
          return getSectionSummary(resolvedSelection.section);
        case 'day':
          return resolvedSelection.day?.day?.trim() || 'day / line';
        case 'time':
          return getTimeSummary(resolvedSelection.time);
        case 'time-note':
          return resolvedSelection.note?.note?.trim() || 'time note';
        default:
          return 'item';
      }
    },
    [normalizedTimes]
  );

  return {
    activePath,
    activePathKey,
    addCategory,
    addDay,
    addSection,
    addTime,
    addTimeNote,
    breadcrumbs,
    describePath,
    detailPanel,
    goBack,
    moveCategories,
    moveDays,
    moveNotes,
    moveSections,
    moveTimes,
    registerField,
    removeCategory,
    removeDay,
    removeSection,
    removeTime,
    removeTimeNote,
    selectPathKey,
    selection,
    setActivePath,
    setDetailPanel,
    times: normalizedTimes,
    updateCategoryName,
    updateDayTitle,
    updateSectionField,
    updateTimeField,
    updateTimeNote
  };
}
