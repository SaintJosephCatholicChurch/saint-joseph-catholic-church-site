import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import {
  TIMES_LINE_MIN_HEIGHT,
  TIMES_LINE_PADDING_MARGIN_HEIGHT,
  TIMES_LINE_TIMES_GAP,
  TIMES_LINE_TIMES_HEIGHT,
  TIMES_PADDING_HEIGHT,
  TIMES_SECTION_MARGIN_HEIGHT,
  TIMES_SECTION_TITLE_HEIGHT,
  TIMES_TITLE_HEIGHT
} from '../../constants';
import { Times } from '../../interface';
import { isNotEmpty } from '../../util/string.util';
import Container from '../layout/Container';
import ScheduleTabPanel from './ScheduleTabPanel';

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
  font-size: 24px;
  font-weight: 400;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  letter-spacing: 0;
  min-height: 124px;

  &.Mui-selected {
    color: #414141;
    background-color: #ffffff;
  }
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
  background?: string;
  backgroundColor?: string;
}

const Schedule = ({ times, background, backgroundColor }: ScheduleProps) => {
  const [value, setValue] = useState(0);

  const handleChange = useCallback((_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }, []);

  const tabsHeight = useMemo(
    () =>
      times.reduce((height, timesEntry) => {
        const linesHeight =
          timesEntry.sections?.reduce((lineCount, section) => {
            return (
              lineCount +
                section.days?.reduce((tempLineHeight, line) => {
                  const lines = line.times?.length ?? 0;
                  let lineTimesHeight = 0;
                  if (lines > 0) {
                    lineTimesHeight =
                      lines * TIMES_LINE_TIMES_HEIGHT +
                      TIMES_LINE_PADDING_MARGIN_HEIGHT +
                      (lines - 1) * TIMES_LINE_TIMES_GAP;
                  }
                  return tempLineHeight + Math.max(lineTimesHeight, TIMES_LINE_MIN_HEIGHT);
                }, 0) ?? 0
            );
          }, 0) ?? 0;

        const sectionsWithTitles =
          timesEntry.sections?.reduce((count, section) => {
            return count + (isNotEmpty(section.name) ? 1 : 0);
          }, 0) ?? 0;

        const calculatedHeight =
          TIMES_TITLE_HEIGHT +
          TIMES_PADDING_HEIGHT +
          TIMES_SECTION_MARGIN_HEIGHT * (timesEntry.sections?.length ?? 0) +
          TIMES_SECTION_TITLE_HEIGHT * sectionsWithTitles +
          linesHeight;

        if (calculatedHeight > height) {
          return calculatedHeight;
        }

        return height;
      }, 0),
    [times]
  );

  return (
    <Box
      sx={{
        pt: 5,
        pb: 5,
        backgroundColor: backgroundColor,
        backgroundImage: background ? `url(${background})` : undefined,
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
            onChange={handleChange}
            aria-label="Vertical tabs example"
            scrollButtons={false}
            sx={{
              minHeight: tabsHeight > 0 ? tabsHeight : undefined
            }}
          >
            {times.map((timeSchedule, index) => (
              <StyledTab key={`time-schedule-${index}`} label={timeSchedule.name} {...a11yProps(index)} />
            ))}
          </StyledTabs>
          <StyledTabPanels>
            {times.map((timeSchedule, index) => (
              <ScheduleTabPanel key={`schedule-tab-${index}`} value={value} index={index} times={timeSchedule} />
            ))}
          </StyledTabPanels>
        </Box>
      </Container>
    </Box>
  );
};

export default Schedule;
