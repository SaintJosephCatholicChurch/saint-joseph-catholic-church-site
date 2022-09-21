import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { memo, MouseEvent, useCallback, useState } from 'react';
import CollapseSection from '../../../components/layout/CollapseSection';
import TabPanel from '../../../components/TabPanel';
import type { Times, TimesDay, TimesSection, TimesTime } from '../../../interface';
import { isNotNullish } from '../../../util/null.util';
import { isNotEmpty } from '../../../util/string.util';

const StyledTabPanelContent = styled('div')`
  padding: 16px;
  padding-left: 32px;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;

  &:not([hidden]) {
    display: flex;
  }
`;

const StyledTabPanelTitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledSections = styled('div')`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
  gap: 8px;

  .MuiCollapse-wrapperInner {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const StyledSectionHeader = styled('div')`
  display: flex;
  gap: 8px;
`;

const StyledDayTimeLines = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledDayTimeLine = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 20px;
  margin-top: 0;
  padding: 8px 0;
  margin-left: 30px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ccc;
  gap: 16px;
`;

const StyledDayTimeLineTitleWrapper = styled('div')`
  display: flex;
  gap: 8px;
  width: 100%;
  padding-right: 48px;
  box-sizing: border-box;
`;

const StyledDayTimeLineTimes = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-left: 40px;
`;

const StyledDayTimeLineTime = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: flex-end;
  gap: 16px;
`;

const StyledDayTimeLineTimeTimesWrapper = styled('div')`
  display: flex;
  gap: 8px;
`;

const StyledDayTimeLineTimeCommentWrapper = styled('div')`
  display: flex;
  gap: 8px;
  padding-left: 40px;
  width: 100%;
  box-sizing: border-box;
`;

const StyledAddButtonWrapper = styled('div')`
  display: flex;
`;

const StyledDeletingTimeDetails = styled('div')`
  display: flex;
  margin-top: 16px;
  gap: 16px;
  align-items: baseline;
`;

const StyledDeletingTimeDetailsNote = styled('div')`
  font-size: 12px;
`;

interface ScheduleTabPanelProps {
  times: Times;
  value: number;
  index: number;
  onChange: (data: Partial<Times>) => void;
  onDelete: () => void;
}

const ScheduleTabPanel = memo(({ times, value, index, onChange, onDelete }: ScheduleTabPanelProps) => {
  const [deleting, setDeleting] = useState(false);
  const handleOnDelete = useCallback(() => setDeleting(true), []);
  const handleOnDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete();
  }, [onDelete]);
  const handleOnDeleteClose = useCallback(() => setDeleting(false), []);

  interface SectionId {
    section: TimesSection;
    index: number;
  }

  const stopPropagationOnClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  const [deletingSection, setDeletingSection] = useState<SectionId | null>(null);
  const handleOnSectionDelete = useCallback(
    (sectionId: SectionId) => (event: MouseEvent) => {
      event.stopPropagation();
      setDeletingSection(sectionId);
    },
    []
  );
  const handleOnSectionDeleteConfirm = useCallback(() => {
    if (deletingSection) {
      const { index } = deletingSection;

      const newSections = [...times.sections];
      newSections.splice(index, 1);
      onChange({ sections: newSections });

      setDeletingSection(null);
    }
  }, [deletingSection, onChange, times.sections]);
  const handleOnSectionDeleteClose = useCallback(() => setDeletingSection(null), []);

  const onSectionAdd = useCallback(() => {
    const newSections = [...times.sections];
    newSections.push({ name: 'New Section', days: [] });
    onChange({ sections: newSections });
  }, [onChange, times.sections]);

  const onSectionChange = useCallback(
    (section: TimesSection, index: number, data: Partial<TimesSection>) => {
      const newSections = [...times.sections];
      newSections[index] = { ...section, ...data };
      onChange({ sections: newSections });
    },
    [onChange, times.sections]
  );

  const onDayLineChange = useCallback(
    (section: TimesSection, sectionIndex: number, day: TimesDay, index: number, data: Partial<TimesDay>) => {
      const newDays = [...section.days];
      newDays[index] = { ...day, ...data };
      onSectionChange(section, sectionIndex, { days: newDays });
    },
    [onSectionChange]
  );

  interface DayLineId {
    section: TimesSection;
    sectionIndex: number;
    day: TimesDay;
    index: number;
  }

  const [deletingDayLine, setDeletingDayLine] = useState<DayLineId | null>(null);
  const handleOnDayLineDelete = useCallback((daylineId: DayLineId) => () => setDeletingDayLine(daylineId), []);
  const handleOnDayLineDeleteConfirm = useCallback(() => {
    if (deletingDayLine) {
      const { section, sectionIndex, day, index } = deletingDayLine;

      const newDays = [...section.days];
      newDays.splice(index, 1);
      onSectionChange(section, sectionIndex, { days: newDays });

      setDeletingDayLine(null);
    }
  }, [deletingDayLine, onSectionChange]);
  const handleOnDayLineDeleteClose = useCallback(() => setDeletingDayLine(null), []);

  const onDayLineAdd = useCallback(
    (section: TimesSection, sectionIndex: number) => () => {
      const newDays = [...section.days];
      newDays.push({ day: 'New Day', times: [] });
      onSectionChange(section, sectionIndex, { days: newDays });
    },
    [onSectionChange]
  );

  const onTimeChange = useCallback(
    (section: TimesSection, sectionIndex: number, day: TimesDay, dayIndex: number, time: TimesTime, index: number) =>
      (data: Partial<TimesTime>) => {
        const newTimes = [...day.times];
        newTimes[index] = { ...time, ...data };
        onDayLineChange(section, sectionIndex, day, dayIndex, { times: newTimes });
      },
    [onDayLineChange]
  );

  interface TimeId {
    section: TimesSection;
    sectionIndex: number;
    day: TimesDay;
    dayIndex: number;
    time: TimesTime;
    index: number;
  }

  const [deletingTime, setDeletingTime] = useState<TimeId | null>(null);
  const handleOnTimeDelete = useCallback((timeId: TimeId) => () => setDeletingTime(timeId), []);
  const handleOnTimeDeleteConfirm = useCallback(() => {
    if (deletingTime) {
      const { section, sectionIndex, day, dayIndex, index } = deletingTime;

      const newTimes = [...day.times];
      newTimes.splice(index, 1);
      onDayLineChange(section, sectionIndex, day, dayIndex, { times: newTimes });

      setDeletingTime(null);
    }
  }, [deletingTime, onDayLineChange]);
  const handleOnTimeDeleteClose = useCallback(() => setDeletingTime(null), []);

  const onTimeAdd = useCallback(
    (section: TimesSection, sectionIndex: number, day: TimesDay, dayIndex: number) => () => {
      const newTimes = [...day.times];
      newTimes.push({});
      onDayLineChange(section, sectionIndex, day, dayIndex, { times: newTimes });
    },
    [onDayLineChange]
  );

  return (
    <>
      <TabPanel value={value} index={index}>
        <StyledTabPanelContent>
          <StyledTabPanelTitleWrapper>
            <TextField
              label="Category"
              value={times.name}
              size="small"
              onChange={(event) => onChange({ name: event.target.value })}
              sx={{
                input: {
                  fontSize: '20px',
                  fontWeight: '500',
                  color: '#333',
                  fontFamily: "'Oswald', Helvetica, Arial, sans-serif"
                }
              }}
            />
            <Button
              variant="outlined"
              aria-label="delete recipe"
              color="error"
              onClick={handleOnDelete}
              title="Delete recipe"
              size="small"
            >
              <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
              Delete
            </Button>
          </StyledTabPanelTitleWrapper>
          {times.sections?.map((section, sectionIndex) => {
            const handleOnDayLineAdd = onDayLineAdd(section, sectionIndex);
            const onSectionDelete = handleOnSectionDelete({ section, index: sectionIndex });
            return (
              <StyledSections key={`section-${sectionIndex}`}>
                <CollapseSection
                  header={
                    <StyledSectionHeader>
                      <TextField
                        label="Section"
                        value={section.name}
                        size="small"
                        onChange={(event) => onSectionChange(section, sectionIndex, { name: event.target.value })}
                        onClick={stopPropagationOnClick}
                        sx={{
                          input: {
                            fontSize: '16x',
                            fontFamily: "'Oswald', Helvetica, Arial, sans-serif"
                          }
                        }}
                      />
                      <IconButton onClick={onSectionDelete} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </StyledSectionHeader>
                  }
                  position="before"
                >
                  <StyledDayTimeLines>
                    {section.days?.map((day, dayIndex) => {
                      const onAddDayTime = onTimeAdd(section, sectionIndex, day, dayIndex);
                      const onDayLineDelete = handleOnDayLineDelete({
                        section,
                        sectionIndex,
                        day,
                        index: dayIndex
                      });

                      return (
                        <StyledDayTimeLine key={`section-${sectionIndex}-day-${dayIndex}`}>
                          <StyledDayTimeLineTitleWrapper>
                            <TextField
                              label="Day / Line Title"
                              value={day.day}
                              size="small"
                              onChange={(event) =>
                                onDayLineChange(section, sectionIndex, day, dayIndex, { day: event.target.value })
                              }
                              fullWidth
                              sx={{
                                input: {
                                  color: '#b58d30',
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  fontFamily: "'Oswald', Helvetica, Arial, sans-serif"
                                }
                              }}
                            />
                            <IconButton onClick={onDayLineDelete} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </StyledDayTimeLineTitleWrapper>
                          {(day.times?.length ?? 0) > 0 ? (
                            <StyledDayTimeLineTimes>
                              {day.times?.map((time, timeIndex) => {
                                const onDayTimeChange = onTimeChange(
                                  section,
                                  sectionIndex,
                                  day,
                                  dayIndex,
                                  time,
                                  timeIndex
                                );
                                const onDayTimeDelete = handleOnTimeDelete({
                                  section,
                                  sectionIndex,
                                  day,
                                  dayIndex,
                                  time,
                                  index: timeIndex
                                });

                                return (
                                  <StyledDayTimeLineTime
                                    key={`section-${sectionIndex}-day-${dayIndex}-times-${timeIndex}`}
                                  >
                                    <StyledDayTimeLineTimeTimesWrapper>
                                      <TimePicker
                                        label="Start Time"
                                        value={isNotEmpty(time.time) ? parse(time.time, 'h:mm a', new Date()) : null}
                                        onChange={(newValue) => {
                                          let newDate = '';
                                          try {
                                            if (newValue) {
                                              newDate = format(newValue, 'h:mm a');
                                            }
                                          } catch {}
                                          onDayTimeChange({ time: newDate });
                                        }}
                                        renderInput={(params) => (
                                          <TextField size="small" {...params} sx={{ fontSize: '15px' }} />
                                        )}
                                        inputFormat="h:mm a"
                                        ampm
                                      />
                                      <TimePicker
                                        key={`section-${sectionIndex}-day-${dayIndex}-end-time-${timeIndex}`}
                                        label="End Time"
                                        value={
                                          isNotEmpty(time.end_time) ? parse(time.end_time, 'h:mm a', new Date()) : null
                                        }
                                        onChange={(newValue) => {
                                          let newDate = '';
                                          try {
                                            if (newValue) {
                                              newDate = format(newValue, 'h:mm a');
                                            }
                                          } catch {}
                                          onDayTimeChange({ end_time: newDate });
                                        }}
                                        renderInput={(params) => (
                                          <TextField size="small" {...params} sx={{ fontSize: '15px' }} />
                                        )}
                                        inputFormat="h:mm a"
                                        ampm
                                      />
                                      <IconButton onClick={onDayTimeDelete} color="error">
                                        <DeleteIcon />
                                      </IconButton>
                                    </StyledDayTimeLineTimeTimesWrapper>
                                    <StyledDayTimeLineTimeCommentWrapper>
                                      <TextField
                                        label="Notes"
                                        value={time.note}
                                        size="small"
                                        onChange={(event) =>
                                          onDayTimeChange({
                                            note: event.target.value
                                          })
                                        }
                                        fullWidth
                                        sx={{
                                          input: {
                                            fontSize: '13px',
                                            color: '#777'
                                          }
                                        }}
                                      />
                                    </StyledDayTimeLineTimeCommentWrapper>
                                  </StyledDayTimeLineTime>
                                );
                              })}
                            </StyledDayTimeLineTimes>
                          ) : null}
                          <Button onClick={onAddDayTime} sx={{ ml: 5 }}>
                            <AddIcon />
                            <Box>Add Time</Box>
                          </Button>
                        </StyledDayTimeLine>
                      );
                    })}
                  </StyledDayTimeLines>
                  <StyledAddButtonWrapper>
                    <Button onClick={handleOnDayLineAdd} sx={{ ml: '30px' }}>
                      <AddIcon />
                      <Box>Add Day / Line</Box>
                    </Button>
                  </StyledAddButtonWrapper>
                </CollapseSection>
              </StyledSections>
            );
          })}
          <StyledAddButtonWrapper>
            <Button onClick={onSectionAdd} sx={{ mt: 2 }}>
              <AddIcon />
              <Box>Add Section</Box>
            </Button>
          </StyledAddButtonWrapper>
        </StyledTabPanelContent>
      </TabPanel>
      <Dialog
        open={deleting}
        onClose={handleOnDeleteClose}
        aria-labelledby="deleting-times-category-title"
        aria-describedby="deleting-times-category-description"
      >
        <DialogTitle id="deleting-times-category-title">Delete times category &quot;{times.name}&quot;</DialogTitle>
        <DialogContent>
          <DialogContentText id="deleting-times category-description">
            Are you sure you want to delete this times category &quot;{times.name}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnDeleteClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleOnDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {isNotNullish(deletingSection) ? (
        <Dialog
          open
          onClose={handleOnSectionDeleteClose}
          aria-labelledby="deleting-section-title"
          aria-describedby="deleting-section-description"
        >
          <DialogTitle id="deleting-section-title">
            Delete section &quot;{deletingSection.section.name}&quot;?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-times category-description">
              Are you sure you want to delete this section &quot;{deletingSection.section.name}&quot;?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnSectionDeleteClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={handleOnSectionDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      {isNotNullish(deletingDayLine) ? (
        <Dialog
          open
          onClose={handleOnDayLineDeleteClose}
          aria-labelledby="deleting-day-line-title"
          aria-describedby="deleting-day-line-description"
        >
          <DialogTitle id="deleting-day-line-title">
            Delete day / line &quot;{deletingDayLine.day.day}&quot;?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-times category-description">
              Are you sure you want to delete this day / line &quot;{deletingDayLine.day.day}&quot;?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnDayLineDeleteClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={handleOnDayLineDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      {isNotNullish(deletingTime) ? (
        <Dialog
          open
          onClose={handleOnTimeDeleteClose}
          aria-labelledby="deleting-time-title"
          aria-describedby="deleting-time-description"
        >
          <DialogTitle id="deleting-time-title">Delete time</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-times category-description">
              Are you sure you want to delete this time?
              <StyledDeletingTimeDetails>
                <Box>{isNotEmpty(deletingTime.time.time) ? deletingTime.time.time : <div>&nbsp;</div>}</Box>
                {isNotEmpty(deletingTime.time.end_time) ? (
                  <>
                    <Box key="deleting-time-divider-end-time">-</Box>
                    <Box key="deleting-time-end-time">{deletingTime.time.end_time}</Box>
                  </>
                ) : null}
                {isNotEmpty(deletingTime.time.note) ? (
                  <StyledDeletingTimeDetailsNote key="deleting-time-note">
                    {deletingTime.time.note}
                  </StyledDeletingTimeDetailsNote>
                ) : null}
              </StyledDeletingTimeDetails>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnTimeDeleteClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={handleOnTimeDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
});

ScheduleTabPanel.displayName = 'ScheduleTabPanel';

export default ScheduleTabPanel;
