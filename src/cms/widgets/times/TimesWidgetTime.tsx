import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, parse } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import CollapseSection from '../../../components/layout/CollapseSection';
import { isNotEmpty } from '../../../util/string.util';
import TimesWidgetTimeNotes from './TimesWidgetTimeNotes';

import type { FC, MouseEvent } from 'react';
import type { TimesTime } from '../../../interface';

const StyledDayTimeLineTime = styled('div')`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const StyledDayTimeLineTimeContent = styled('div')(
  () => `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    flex-grow: 1;
    padding: 12px 8px;

    .MuiCollapse-wrapperInner {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `
);

const StyledDayTimeLineTimeTimesWrapper = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledDayTimeLineTimeCommentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: flex-start;
`;

const StyledDeletingTimeDetails = styled('div')`
  display: flex;
  margin-top: 16px;
  gap: 16px;
  align-items: baseline;
`;

const StyledDragHandle = styled('div')(
  ({ theme }) => `
    cursor: grab;
    color: ${theme.palette.text.primary};
    background: #eee;
    border-radius: 4px 0 0 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `
);

const StyledTimesHeaderWrapper = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
`;

export interface TimesWidgetTimeProps {
  time: TimesTime;
  onChange: (time: TimesTime) => void;
  onDelete: (time: TimesTime) => void;
}

const TimesWidgetTime: FC<TimesWidgetTimeProps> = ({ time, onChange, onDelete }) => {
  const stopPropagation = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  const [deleting, setDeleting] = useState(false);
  const handleDelete = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setDeleting(true);
  }, []);
  const handleDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete(time);
  }, [onDelete, time]);
  const handleDeleteClose = useCallback(() => setDeleting(false), []);

  const handleChange = useCallback(
    (data: Partial<TimesTime>) => {
      onChange({ ...time, ...data });
    },
    [onChange, time]
  );

  const sortableProps = useMemo(() => ({ id: time.id }), [time]);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable(sortableProps);

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition
    }),
    [transform, transition]
  );

  return (
    <div key={`section-day-time-${time.id}`} ref={setNodeRef} style={style} {...attributes}>
      <StyledDayTimeLineTime>
        <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
          <DragIndicatorIcon />
        </StyledDragHandle>
        <StyledDayTimeLineTimeContent>
          <CollapseSection
            position="before"
            startCollapsed
            header={
              <StyledTimesHeaderWrapper>
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
                      } catch (e) {
                        console.error(e);
                      }
                      handleChange({ time: newDate });
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { fontSize: '15px' },
                        onClick: stopPropagation
                      }
                    }}
                    format="h:mm a"
                    ampm
                  />
                  <TimePicker
                    key={`section-day-time-${time.id}-end-time`}
                    label="End Time"
                    value={isNotEmpty(time.end_time) ? parse(time.end_time, 'h:mm a', new Date()) : null}
                    onChange={(newValue) => {
                      let newDate = '';
                      try {
                        if (newValue) {
                          newDate = format(newValue, 'h:mm a');
                        }
                      } catch (e) {
                        console.error(e);
                      }
                      handleChange({ end_time: newDate });
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { fontSize: '15px' },
                        onClick: stopPropagation
                      }
                    }}
                    format="h:mm a"
                    ampm
                  />
                  <IconButton onClick={handleDelete} color="error">
                    <DeleteIcon />
                  </IconButton>
                </StyledDayTimeLineTimeTimesWrapper>
              </StyledTimesHeaderWrapper>
            }
          >
            <StyledDayTimeLineTimeCommentWrapper>
              <TimesWidgetTimeNotes times={time.notes} onChange={(notes) => handleChange({ notes })} />
            </StyledDayTimeLineTimeCommentWrapper>
          </CollapseSection>
        </StyledDayTimeLineTimeContent>
      </StyledDayTimeLineTime>
      {deleting ? (
        <Dialog
          key={`deleting-section-day-time-${time.id}`}
          open
          onClose={handleDeleteClose}
          aria-labelledby="deleting-time-title"
          aria-describedby="deleting-time-description"
        >
          <DialogTitle id="deleting-time-title">Delete time</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-times category-description">
              Are you sure you want to delete this time?
              <StyledDeletingTimeDetails>
                <div>{isNotEmpty(time.time) ? time.time : <div>&nbsp;</div>}</div>
                {isNotEmpty(time.end_time) ? (
                  <>
                    <div key="deleting-time-divider-end-time">-</div>
                    <div key="deleting-time-end-time">{time.end_time}</div>
                  </>
                ) : null}
              </StyledDeletingTimeDetails>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </div>
  );
};

export default TimesWidgetTime;
