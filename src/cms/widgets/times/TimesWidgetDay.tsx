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
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';

import CollapseSection from '../../../components/layout/CollapseSection';
import TimesWidgetTimes from './TimesWidgetTimes';

import type { FC } from 'react';
import type { TimesDay } from '../../../interface';

const StyledDayTimeLine = styled('div')`
  display: flex;
  margin-top: 0;
  margin-left: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledDayTimeLineContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 20px;
  padding: 12px 8px;
  flex-grow: 1;
`;

const StyledDayTimeLineTimes = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
`;

const StyledDayTimeLineTitleWrapper = styled('div')`
  display: flex;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
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

export interface TimesWidgetDayProps {
  day: TimesDay;
  onChange: (day: TimesDay) => void;
  onDelete: (day: TimesDay) => void;
}

const TimesWidgetDay: FC<TimesWidgetDayProps> = ({ day, onChange, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = useCallback(() => setDeleting(true), []);
  const handleDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete(day);
  }, [onDelete, day]);
  const handleDeleteClose = useCallback(() => setDeleting(false), []);

  const handleChange = useCallback(
    (data: Partial<TimesDay>) => {
      onChange({ ...day, ...data });
    },
    [onChange, day]
  );

  const sortableProps = useMemo(() => ({ id: day.id }), [day]);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable(sortableProps);

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition
    }),
    [transform, transition]
  );

  return (
    <div key={`section-day-${day.id}`} ref={setNodeRef} style={style} {...attributes}>
      <StyledDayTimeLine>
        <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
          <DragIndicatorIcon />
        </StyledDragHandle>
        <StyledDayTimeLineContent>
          <CollapseSection
            startCollapsed
            position="before"
            header={
              <StyledDayTimeLineTitleWrapper>
                <TextField
                  label="Day / Line Title"
                  value={day.day}
                  size="small"
                  onChange={(event) => handleChange({ day: event.target.value })}
                  fullWidth
                  sx={{
                    input: {
                      color: '#8D6D26',
                      fontWeight: 500,
                      fontSize: '14px',
                      fontFamily: "'Oswald', Helvetica, Arial, sans-serif"
                    }
                  }}
                />
                <IconButton onClick={handleDelete} color="error">
                  <DeleteIcon />
                </IconButton>
              </StyledDayTimeLineTitleWrapper>
            }
          >
            <StyledDayTimeLineTimes>
              <TimesWidgetTimes times={day.times} onChange={(times) => handleChange({ times })} />
            </StyledDayTimeLineTimes>
          </CollapseSection>
        </StyledDayTimeLineContent>
      </StyledDayTimeLine>
      {deleting ? (
        <Dialog
          key={`deleting-section-day-${day.id}`}
          open
          onClose={handleDeleteClose}
          aria-labelledby="deleting-day-line-title"
          aria-describedby="deleting-day-line-description"
        >
          <DialogTitle id="deleting-day-line-title">Delete day / line &quot;{day.day}&quot;?</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-times category-description">
              Are you sure you want to delete this day / line &quot;{day.day}&quot;?
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

export default TimesWidgetDay;
