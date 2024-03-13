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
import TimesWidgetDays from './TimesWidgetDays';

import type { MouseEvent } from 'react';
import type { TimesNoteSection, TimesSection } from '../../../interface';

const StyledNotesSectionContentWrapper = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
  padding-left: 28px;
  justify-content: space-between;
  width: 100%;
`;

const StyledSection = styled('div')`
  display: flex;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const StyledSectionContent = styled('div')(
  () => `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: 12px 8px;

    .MuiCollapse-wrapperInner {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `
);

const StyledDayTimeLine = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: items-center;
  justify-content: space-between;
  min-height: 20px;
  margin-top: 0;
  gap: 16px;
  border-bottom: #ccc;
  border-radius: 4px;
  width: 100%;
`;

const StyledDayTimeLineTitleWrapper = styled('div')`
  display: flex;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
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
  justify-content: space-between;
  flex-grow: 1;
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
          <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
            <DragIndicatorIcon />
          </StyledDragHandle>
          <StyledSectionContent>
            <StyledNotesSectionContentWrapper>
              <StyledDayTimeLine>
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
            </StyledNotesSectionContentWrapper>
          </StyledSectionContent>
        </StyledSection>
        {deleting ? (
          <Dialog
            key={`deleting-section-note-${section.id}`}
            open
            onClose={handleDeleteClose}
            aria-labelledby="deleting-section-title"
            aria-describedby="deleting-section-description"
          >
            <DialogTitle id="deleting-section-title">
              <span key="delete-note">Delete note &quot;{section.note}&quot;?</span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="deleting-times category-description">
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
        <StyledDragHandle ref={setActivatorNodeRef} {...listeners}>
          <DragIndicatorIcon />
        </StyledDragHandle>
        <StyledSectionContent>
          <CollapseSection
            position="before"
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
              </StyledSectionHeaderWrapper>
            }
          >
            <TimesWidgetDays days={section.days} onChange={(days) => handleChange({ days } as T)} />
          </CollapseSection>
        </StyledSectionContent>
      </StyledSection>
      {deleting ? (
        <Dialog
          key={`deleting-section-${section.id}`}
          open
          onClose={handleDeleteClose}
          aria-labelledby="deleting-section-title"
          aria-describedby="deleting-section-description"
        >
          <DialogTitle id="deleting-section-title">
            <span key="delete-section">Delete section &quot;{section.name}&quot;?</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deleting-times category-description">
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
