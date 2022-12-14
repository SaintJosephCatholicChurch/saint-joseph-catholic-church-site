import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useCallback, useState } from 'react';

import Container from '../../../components/layout/Container';
import ScheduleTabChangeEvent from '../../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../../util/window.util';
import ScheduleTabPanel from './TimesWidgetTabPanelWidget';

import type { SyntheticEvent } from 'react';
import type { Times } from '../../../interface';

const StyledScheduleWidget = styled('div')`
  border: 1px solid rgb(223, 223, 227);
  background-color: rgba(241, 241, 241, 0.75);
  background-repeat: repeat;
  background-position: center top;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledScheduleWidgetContent = styled('div')`
  display: grid;
  grid-template-columns: 2fr 5fr;
  width: 100%;
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
    window.dispatchEvent(new ScheduleTabChangeEvent(newValue));
  }, []);

  const handleTabChangeEvent = useCallback((event: ScheduleTabChangeEvent) => {
    setValue(event.detail);
  }, []);

  useWindowEvent('scheduleTabChange', handleTabChangeEvent);

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
    <StyledScheduleWidget>
      <Container disablePadding>
        <StyledScheduleWidgetContent>
          <Tabs
            orientation="vertical"
            variant="standard"
            value={value}
            onChange={handleTabChange}
            aria-label="Vertical tabs example"
            scrollButtons={false}
            sx={{
              backgroundColor: 'rgba(241, 241, 241, 0.75)',
              '& .MuiTabs-indicator': {
                backgroundColor: '#8D6D26',
                width: '4px'
              }
            }}
          >
            {times.map((timeSchedule, index) => (
              <Tab
                key={`time-schedule-${index}`}
                label={timeSchedule.name}
                {...a11yProps(index)}
                sx={{
                  color: '#414141',
                  alignItems: 'flex-start',
                  padding: '32px',
                  fontSize: '16px',
                  fontWeight: 400,
                  fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
                  letterSpacing: 0,
                  minHeight: '80px',
                  '&.Mui-selected': {
                    color: '#414141',
                    backgroundColor: '#ffffff'
                  }
                }}
              />
            ))}
            <Button
              onClick={handleAddTimes}
              sx={{
                padding: '28px 32px',
                fontSize: '16px',
                fontWeight: 400,
                fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
                letterSpacing: 0,
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <AddIcon />
              <Box>Add Category</Box>
            </Button>
          </Tabs>
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
        </StyledScheduleWidgetContent>
      </Container>
    </StyledScheduleWidget>
  );
};

export default Schedule;
