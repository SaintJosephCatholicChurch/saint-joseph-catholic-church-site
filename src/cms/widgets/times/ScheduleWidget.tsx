import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SyntheticEvent, useCallback, useState } from 'react';
import Container from '../../../components/layout/Container';
import { Times } from '../../../interface';
import ScheduleTabPanel from './ScheduleTabPanelWidget';

const StyledTabs = styled(Tabs)`
  background-color: rgba(241, 241, 241, 0.75);

  & .MuiTabs-indicator {
    background-color: #d2ac54;
    width: 4px;
  }
`;

const StyledTab = styled(Tab)`
  color: #414141;
  align-items: flex-start;
  padding: 32px;
  font-size: 16px;
  font-weight: 400;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  letter-spacing: 0;
  min-height: 80px;

  &.Mui-selected {
    color: #414141;
    background-color: #ffffff;
  }
`;

const AddTabButton = styled(Button)`
  align-items: flex-start;
  padding: 28px 32px;
  font-size: 16px;
  font-weight: 400;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  letter-spacing: 0;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const StyledTabPanels = styled('div')`
  width: 100%;
  background-color: #ffffff;
  position: relative;
`;

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

interface ScheduleProps {
  times: Times[];
  onChange: (times: Times[]) => void;
}

const Schedule = ({ times, onChange }: ScheduleProps) => {
  const [value, setValue] = useState(0);

  const handleTabChange = useCallback((_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }, []);

  const handleDataChange = useCallback(
    (timesValue: Times, index: number) => (newData: Partial<Times>) => {
      const newTimes = [...times];
      newTimes[index] = { ...timesValue, ...newData };
      onChange(newTimes);
    },
    [onChange, times]
  );

  const handleAddTimes = useCallback(() => {
    const newTimes = [...times];
    newTimes.push({ name: 'New Times', sections: [] });
    onChange(newTimes);
  }, [onChange, times]);

  const handleRemoveTimes = useCallback(
    (index: number) => () => {
      const newTimes = [...times];
      newTimes.splice(index, 1);
      onChange(newTimes);
    },
    [onChange, times]
  );

  return (
    <Box
      sx={{
        border: '1px solid rgb(223, 223, 227)',
        backgroundColor: 'rgba(241, 241, 241, 0.75)',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center top',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 5fr',
            width: '100%'
          }}
        >
          <StyledTabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleTabChange}
            aria-label="Vertical tabs example"
            scrollButtons={false}
          >
            {times.map((timeSchedule, index) => (
              <StyledTab key={`time-schedule-${index}`} label={timeSchedule.name} {...a11yProps(index)} />
            ))}
            <AddTabButton onClick={handleAddTimes}>
              <AddIcon />
              <Box>Add Category</Box>
            </AddTabButton>
          </StyledTabs>
          <StyledTabPanels>
            {times.map((timeSchedule, index) => (
              <ScheduleTabPanel
                key={`schedule-tab-${index}`}
                value={value}
                index={index}
                times={timeSchedule}
                onChange={handleDataChange(timeSchedule, index)}
                onDelete={handleRemoveTimes(index)}
              />
            ))}
          </StyledTabPanels>
        </Box>
      </Container>
    </Box>
  );
};

export default Schedule;
