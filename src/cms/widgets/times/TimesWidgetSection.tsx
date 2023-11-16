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
import { useCallback, useState } from 'react';

import CollapseSection from '../../../components/layout/CollapseSection';
import transientOptions from '../../../util/transientOptions';
import TimesWidgetDays from './TimesWidgetDays';

import type { MouseEvent } from 'react';
import type { TimesNoteSection, TimesSection } from '../../../interface';

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
  padding-right: 48px;
  box-sizing: border-box;
`;

const StyledSectionHeader = styled('div')`
  display: flex;
  gap: 8px;
`;

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

  if ('note' in section) {
    return (
      <>
        <StyledSections key={`section-note-${section.id}`}>
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
        </StyledSections>
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
      </>
    );
  }

  return (
    <>
      <StyledSections key={`section-${section.id}`}>
        <CollapseSection
          header={
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
          }
          position="before"
        >
          <TimesWidgetDays days={section.days} onChange={(days) => handleChange({ days } as T)} />
        </CollapseSection>
      </StyledSections>
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
    </>
  );
};

export default TimesWidgetSection;
