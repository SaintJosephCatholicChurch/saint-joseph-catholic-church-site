import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { memo, useCallback, useState } from 'react';

import TabPanel from '../../../components/TabPanel';
import TimesWidgetSections from './TimesWidgetSections';

import type { Times } from '../../../interface';

const StyledTabPanelContent = styled('div')`
  padding: 16px;
  padding-left: 24px;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  gap: 16px;

  &:not([hidden]) {
    display: flex;
  }
`;

const StyledTabPanelTitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

  return (
    <>
      <TabPanel value={value} index={index}>
        <StyledTabPanelContent>
          <StyledTabPanelTitleWrapper>
            <TextField
              label="Category Name"
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
          <TimesWidgetSections sections={times.sections} onChange={(sections) => onChange({ sections })} />
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
    </>
  );
});

ScheduleTabPanel.displayName = 'ScheduleTabPanel';

export default ScheduleTabPanel;
