import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { useCallback, useMemo, useState } from 'react';

import { isNotEmpty } from '../../../util/string.util';

import type { FC } from 'react';
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
    gap: 16px;
    flex-grow: 1;
    padding: 12px 8px;
  `
);

const StyledDayTimeLineTimeTimesWrapper = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledDayTimeLineTimeCommentWrapper = styled('div')`
  display: flex;
  gap: 8px;
  padding-left: 40px;
  width: 100%;
  box-sizing: border-box;
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

export interface TimesWidgetTimeProps {
  time: TimesTime;
  onChange: (time: TimesTime) => void;
  onDelete: (time: TimesTime) => void;
}

const TimesWidgetTime: FC<TimesWidgetTimeProps> = ({ time, onChange, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = useCallback(() => setDeleting(true), []);
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
                  sx: { fontSize: '15px' }
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
                  sx: { fontSize: '15px' }
                }
              }}
              format="h:mm a"
              ampm
            />
            <IconButton onClick={handleDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </StyledDayTimeLineTimeTimesWrapper>
          <StyledDayTimeLineTimeCommentWrapper>
            <TextField
              label="Notes"
              value={time.note}
              size="small"
              onChange={(event) =>
                handleChange({
                  note: event.target.value
                })
              }
              fullWidth
              sx={{
                input: {
                  fontSize: '13px',
                  color: '#757575'
                }
              }}
            />
          </StyledDayTimeLineTimeCommentWrapper>
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
                <Box>{isNotEmpty(time.time) ? time.time : <div>&nbsp;</div>}</Box>
                {isNotEmpty(time.end_time) ? (
                  <>
                    <Box key="deleting-time-divider-end-time">-</Box>
                    <Box key="deleting-time-end-time">{time.end_time}</Box>
                  </>
                ) : null}
                {isNotEmpty(time.note) ? (
                  <StyledDeletingTimeDetailsNote key="deleting-time-note">{time.note}</StyledDeletingTimeDetailsNote>
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
