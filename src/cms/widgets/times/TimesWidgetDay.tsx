import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
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

import transientOptions from '../../../util/transientOptions';
import TimesWidgetTimes from './TimesWidgetTimes';

import type { FC } from 'react';
import type { TimesDay } from '../../../interface';

interface StyledDayTimeLineProps {
  $noBorderBottom?: boolean;
}

const StyledDayTimeLine = styled(
  'div',
  transientOptions
)<StyledDayTimeLineProps>(
  ({ $noBorderBottom }) => `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 20px;
    margin-top: 0;
    padding: 8px 0;
    margin-left: 30px;
    padding-bottom: 16px;
    gap: 16px;
    ${$noBorderBottom ? '' : 'border-bottom: 1px solid #ccc;'}
  `
);

const StyledDayTimeLineTitleWrapper = styled('div')`
  display: flex;
  gap: 8px;
  width: 100%;
  padding-right: 32px;
  box-sizing: border-box;
  align-items: center;
`;

const StyledDragHandle = styled('div')(
  ({ theme }) => `
    cursor: grab;
    color: ${theme.palette.text.secondary};
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
          <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
            <DragHandleIcon />
          </StyledDragHandle>
        </StyledDayTimeLineTitleWrapper>
        <TimesWidgetTimes times={day.times} onChange={(times) => handleChange({ times })} />
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
