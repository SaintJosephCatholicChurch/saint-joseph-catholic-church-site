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
import { useCallback, useMemo, useState } from 'react';

import { isNotEmpty } from '../../../util/string.util';

import type { FC } from 'react';
import type { TimesTimeNote } from '../../../interface';

const StyledDayTimeNote = styled('div')`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  padding-right: 8px;
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

export interface TimesWidgetTimeNoteProps {
  note: TimesTimeNote;
  onChange: (note: TimesTimeNote) => void;
  onDelete: (note: TimesTimeNote) => void;
}

const TimesWidgetTimeNote: FC<TimesWidgetTimeNoteProps> = ({ note, onChange, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = useCallback(() => setDeleting(true), []);
  const handleDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete(note);
  }, [onDelete, note]);
  const handleDeleteClose = useCallback(() => setDeleting(false), []);

  const handleChange = useCallback(
    (data: Partial<TimesTimeNote>) => {
      onChange({ ...note, ...data });
    },
    [onChange, note]
  );

  const sortableProps = useMemo(() => ({ id: note.id }), [note]);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable(sortableProps);

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition
    }),
    [transform, transition]
  );

  return (
    <div key={`section-day-time-note-${note.id}`} ref={setNodeRef} style={style} {...attributes}>
      <StyledDayTimeNote>
        <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
          <DragIndicatorIcon />
        </StyledDragHandle>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ padding: '12px', width: '100%' }}>
            <TextField
              label="Note"
              value={note.note}
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
          </Box>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </StyledDayTimeNote>
      {deleting ? (
        <Dialog
          key={`deleting-section-day-time-note-${note.id}`}
          open
          onClose={handleDeleteClose}
          aria-labelledby="deleting-time-title"
          aria-describedby="deleting-time-description"
        >
          <DialogTitle id="deleting-time-title">Delete time</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-note category-description">
              Are you sure you want to delete this note?
              <StyledDeletingTimeDetails>
                <Box>{isNotEmpty(note.note) ? note.note : <div>&nbsp;</div>}</Box>
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

export default TimesWidgetTimeNote;
