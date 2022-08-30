import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
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
import useSmallScreen from '../../util/smallScreen.util';
import { isNotEmpty } from '../../util/string.util';
import Container from '../layout/Container';
import MobileScheduleTabPanel from './MobileSchedulePanel';
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
  font-weight: 400;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  letter-spacing: 0;

  &.Mui-selected {
    color: #414141;
    background-color: #ffffff;
  }

  font-size: 18px;
  padding: 16px;
  min-height: 100px;
  @media screen and (min-width: 1200px) {
    font-size: 24px;
    padding: 32px;
    min-height: 124px;
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
  tab?: number;
  onTabChange?: (index: number) => void;
}

const Schedule = ({ times, background, backgroundColor, tab, onTabChange }: ScheduleProps) => {
  const theme = useTheme();

  const [value, setValue] = useState(0);

  const handleChange = useCallback(
    (_event: SyntheticEvent, newValue: number) => {
      setValue(newValue);
      onTabChange?.(newValue);
    },
    [onTabChange]
  );

  useEffect(() => {
    if (tab !== undefined && tab !== value) {
      setValue(tab);
    }
  }, [tab, value]);

  const isMobile = useSmallScreen();
  const isSmallScreen = useSmallScreen(900);
  const isMediumScreen = useSmallScreen(1200);

  const size = useMemo(() => {
    if (isMobile) {
      return 'mobile';
    }

    if (isSmallScreen) {
      return 'small';
    }

    if (isMediumScreen) {
      return 'medium';
    }

    return 'large';
  }, [isMediumScreen, isMobile, isSmallScreen]);

  const tabsHeight = useMemo(() => {
    if (size === 'mobile') {
      return 0;
    }

    return times.reduce((height, timesEntry) => {
      const linesHeight =
        timesEntry.sections?.reduce((lineCount, section) => {
          return (
            lineCount +
              section.days?.reduce((tempLineHeight, line) => {
                const lines = line.times?.length ?? 0;
                let lineTimesHeight = 0;
                if (lines > 0) {
                  lineTimesHeight =
                    lines * TIMES_LINE_TIMES_HEIGHT(size) +
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
        TIMES_TITLE_HEIGHT(size) +
        TIMES_PADDING_HEIGHT(size) +
        TIMES_SECTION_MARGIN_HEIGHT * (timesEntry.sections?.length ?? 0) +
        TIMES_SECTION_TITLE_HEIGHT * sectionsWithTitles +
        linesHeight;

      if (calculatedHeight > height) {
        return calculatedHeight;
      }

      return height;
    }, 0);
  }, [size, times]);

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
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            [theme.breakpoints.up('md')]: {
              display: 'none'
            }
          }}
          component="div"
          aria-labelledby="nested-list-subheader"
          disablePadding
        >
          {times.map((timeSchedule, index) => (
            <MobileScheduleTabPanel key={`mobile-schedule-panel-${index}`} times={timeSchedule} index={index} />
          ))}
        </List>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 5fr',
            width: '100%',
            [theme.breakpoints.down('md')]: {
              display: 'none'
            }
          }}
        >
          <StyledTabs
            orientation="vertical"
            variant="fullWidth"
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
