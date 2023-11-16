import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useCallback, useMemo, useState } from 'react';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import CollapseSection from '../../../components/layout/CollapseSection';
import transientOptions from '../../../util/transientOptions';
import TimesWidgetDays from './TimesWidgetDays';

import type { MouseEvent } from 'react';
import type { TimesNoteSection, TimesSection } from '../../../interface';

const StyledNotesSectionContentWrapper = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
  padding-left: 28px;
  justify-content: space-between;
`;

const StyledSection = styled('div')`
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
    align-items: items-center;
    justify-content: space-between;
    min-height: 20px;
    margin-top: 0;
    gap: 16px;
    ${$noBorderBottom ? '' : 'border-bottom: 1px solid #ccc;'}
  `
);

const StyledDayTimeLineTitleWrapper = styled('div')`
  display: flex;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
`;

const StyledSectionHeaderWrapper = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
`;

const StyledSectionHeader = styled('div')`
  display: flex;
  gap: 8px;
`;

const StyledDragHandle = styled('div')(
  ({ theme }) => `
    cursor: grab;
    color: ${theme.palette.text.secondary};
  `
);

export interface TimesWidgetSectionProps<T extends TimesSection | TimesNoteSection> {
  section: T;
  onChange: (section: T) => void;
  onDelete: (section: T) => void;
}

const TimesWidgetSection = function <T extends TimesSection | TimesNoteSection>({
  section,
  onChange,
  onDelete
}: TimesWidgetSectionProps<T>) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setDeleting(true);
  }, []);
  const handleDeleteConfirm = useCallback(() => {
    setDeleting(false);
    onDelete(section);
  }, [onDelete, section]);
  const handleDeleteClose = useCallback(() => setDeleting(false), []);

  const handleChange = useCallback(
    (data: Partial<T>) => {
      onChange({ ...section, ...data });
    },
    [onChange, section]
  );

  const stopPropagationOnClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  const sortableProps = useMemo(() => ({ id: section.id }), [section]);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable(sortableProps);

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition
    }),
    [transform, transition]
  );

  if ('note' in section) {
    return (
      <div key={`section-note-${section.id}`} ref={setNodeRef} style={style} {...attributes}>
        <StyledSection>
          <StyledNotesSectionContentWrapper>
            <StyledDayTimeLine $noBorderBottom={true}>
              <StyledDayTimeLineTitleWrapper>
                <TextField
                  label="Note"
                  value={section.note}
                  size="small"
                  onChange={(event) => handleChange({ note: event.target.value } as T)}
                  fullWidth
                  sx={{
                    input: {
                      fontSize: '13px',
                      color: '#757575'
                    }
                  }}
                />
                <IconButton onClick={handleDelete} color="error">
                  <DeleteIcon />
                </IconButton>
              </StyledDayTimeLineTitleWrapper>
            </StyledDayTimeLine>
            <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
              <DragHandleIcon />
            </StyledDragHandle>
          </StyledNotesSectionContentWrapper>
        </StyledSection>
        {deleting ? (
          <Dialog
            key={`deleting-section-note-${section.id}`}
            open
            onClose={handleDeleteClose}
            aria-labelledby="deleting-section-title"
            aria-describedby="deleting-section-description"
          >
            <DialogTitle id="deleting-section-title" className="text-gray-800 dark:text-white">
              <span key="delete-note">Delete note &quot;{section.note}&quot;?</span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="deleting-times category-description" className="text-gray-800 dark:text-white">
                <span key="delete-note-body">
                  Are you sure you want to delete this note &quot;{section.note}&quot;?
                </span>
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
  }

  return (
    <div key={`section-${section.id}`} ref={setNodeRef} style={style} {...attributes}>
      <StyledSection>
        <CollapseSection
          header={
            <StyledSectionHeaderWrapper>
              <StyledSectionHeader>
                <TextField
                  label="Section"
                  value={section.name}
                  size="small"
                  onChange={(event) => handleChange({ name: event.target.value } as T)}
                  onClick={stopPropagationOnClick}
                  sx={{
                    input: {
                      fontSize: '16x',
                      fontFamily: "'Oswald', Helvetica, Arial, sans-serif"
                    }
                  }}
                />
                <IconButton onClick={handleDelete} color="error">
                  <DeleteIcon />
                </IconButton>
              </StyledSectionHeader>
              <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
                <DragHandleIcon />
              </StyledDragHandle>
            </StyledSectionHeaderWrapper>
          }
          position="before"
        >
          <TimesWidgetDays days={section.days} onChange={(days) => handleChange({ days } as T)} />
        </CollapseSection>
      </StyledSection>
      {deleting ? (
        <Dialog
          key={`deleting-section-${section.id}`}
          open
          onClose={handleDeleteClose}
          aria-labelledby="deleting-section-title"
          aria-describedby="deleting-section-description"
        >
          <DialogTitle id="deleting-section-title" className="text-gray-800 dark:text-white">
            <span key="delete-section">Delete section &quot;{section.name}&quot;?</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-times category-description" className="text-gray-800 dark:text-white">
              <span key="delete-section-body">
                Are you sure you want to delete this section &quot;{section.name}&quot;?
              </span>
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

export default TimesWidgetSection;
