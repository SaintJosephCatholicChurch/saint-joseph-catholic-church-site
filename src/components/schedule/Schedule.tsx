import LiveTvIcon from '@mui/icons-material/LiveTv';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  EXTRA_EXTRA_SMALL_BREAKPOINT,
  TIMES_LINE_MIN_HEIGHT,
  TIMES_LINE_PADDING_MARGIN_HEIGHT,
  TIMES_LINE_TIMES_GAP,
  TIMES_LINE_TIMES_HEIGHT,
  TIMES_PADDING_HEIGHT,
  TIMES_SECTION_MARGIN_HEIGHT,
  TIMES_SECTION_TITLE_HEIGHT,
  TIMES_TITLE_HEIGHT
} from '../../constants';
import { isNotEmpty } from '../../util/string.util';
import { useMediaQueryDown } from '../../util/useMediaQuery';
import MobileScheduleTabPanel from './MobileSchedulePanel';
import ScheduleTabPanel from './ScheduleTabPanel';

import type { SyntheticEvent } from 'react';
import type { LiveStreamButton, Times } from '../../interface';

const StyledContainerContents = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledHeader = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    ${theme.breakpoints.down('md')} {
      font-size: 24px;
    }
  `
);

const StyledHeaderPreText = styled('h1')(
  ({ theme }) => `
    font-weight: 500;
    color: #9d7b2a;
    margin-top: 24px;

    font-size: 28px;
    ${theme.breakpoints.up('lg')} {
      font-size: 28px;
    }
  `
);

const StyledHeaderText = styled('h1')(
  ({ theme }) => `
    font-weight: 500;
    color: #333;
    padding: 0;
    padding-bottom: 16px;
    margin: 0;
    text-transform: uppercase;

    font-size: 24px;
    line-height: 24px;
    
    ${theme.breakpoints.up('lg')} {
      font-size: 30px;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      font-size: 20px;
      line-height: 20px;
    }
  `
);

const StyledHeaderBorder = styled('div')`
  border-bottom: 2px solid #bbbbbb;
  width: 50%;
`;

const StyledTabsWrapper = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: 2fr 5fr;
    width: 100%;
    ${theme.breakpoints.down('md')} {
      visibility: hidden;
      width: 0;
      height: 0;
    }
  `
);

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
  title?: string;
  liveStreamButton?: LiveStreamButton;
  invitationText?: string;
  tab?: number;
  onTabChange?: (index: number) => void;
}

const Schedule = ({ times, title, liveStreamButton, invitationText, tab, onTabChange }: ScheduleProps) => {
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

  const isMobile = useMediaQueryDown('sm');
  const isSmallScreen = useMediaQueryDown('md');
  const isMediumScreen = useMediaQueryDown('lg');

  const screenSize = useMemo(() => {
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
    if (screenSize === 'mobile') {
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
                    lines * TIMES_LINE_TIMES_HEIGHT(screenSize) +
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
        TIMES_PADDING_HEIGHT(screenSize) +
        TIMES_SECTION_MARGIN_HEIGHT * (timesEntry.sections?.length ?? 0) +
        TIMES_SECTION_TITLE_HEIGHT * sectionsWithTitles +
        linesHeight;

      if (calculatedHeight > height) {
        return calculatedHeight;
      }

      return height;
    }, 0);
  }, [screenSize, times]);

  return (
    <StyledContainerContents>
      <StyledHeader>
        {isNotEmpty(invitationText) ? (
          <>
            <StyledHeaderText key="invitation-text">{invitationText}</StyledHeaderText>
            <StyledHeaderBorder key="invitation-text-divider" />
          </>
        ) : null}
        {isNotEmpty(liveStreamButton?.url) && isNotEmpty(liveStreamButton?.title) ? (
          <Link key="live-stream-button" href={liveStreamButton.url}>
            <Button
              href={liveStreamButton.url}
              variant="contained"
              size="large"
              startIcon={<LiveTvIcon />}
              sx={{
                marginTop: '16px',
                fontSize: '20px',
                backgroundColor: '#bc2f3b',
                '&:hover': {
                  backgroundColor: '#d24c57',
                  color: '#ffffff'
                },
                '.MuiButton-startIcon > *:nth-of-type(1)': {
                  fontSize: '24px'
                },
                [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)]: {
                  fontSize: '16px',
                  '.MuiButton-startIcon > *:nth-of-type(1)': {
                    fontSize: '20px'
                  }
                }
              }}
            >
              {liveStreamButton.title}
            </Button>
          </Link>
        ) : null}
        <Link key="bulletin-button" href="/parish-bulletins">
          <Button
            href="/parish-bulletins"
            variant="text"
            size="large"
            startIcon={<NewspaperIcon />}
            sx={{
              fontSize: '18px',
              color: '#bc2f3b',
              '&:hover': {
                backgroundColor: 'rgba(210, 76, 87, 0.1)',
                color: '#d24c57'
              },
              '.MuiButton-startIcon > *:nth-of-type(1)': {
                fontSize: '22px'
              },
              [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)]: {
                fontSize: '14px',
                '.MuiButton-startIcon > *:nth-of-type(1)': {
                  fontSize: '18px'
                }
              }
            }}
          >
            Bulletins
          </Button>
        </Link>
        {isNotEmpty(title) ? <StyledHeaderPreText key="title">{title}</StyledHeaderPreText> : null}
      </StyledHeader>
      <List
        component="div"
        aria-labelledby="nested-list-subheader"
        disablePadding
        sx={{
          width: '100%',
          [theme.breakpoints.up('md')]: {
            display: 'none'
          }
        }}
      >
        {times.map((timeSchedule, index) => (
          <MobileScheduleTabPanel key={`mobile-schedule-panel-${index}`} times={timeSchedule} index={index} />
        ))}
      </List>
      <StyledTabsWrapper>
        <Tabs
          orientation="vertical"
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          scrollButtons={false}
          sx={{
            backgroundColor: 'rgba(241, 241, 241, 0.35)',
            minHeight: tabsHeight > 0 ? tabsHeight : undefined,
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
                fontWeight: 400,
                fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
                letterSpacing: 0,
                textAlign: 'left',
                '&.Mui-selected': {
                  color: '#414141',
                  backgroundColor: '#ffffff'
                },
                fontSize: '18px',
                padding: '16px',
                minHeight: '100px',
                [theme.breakpoints.up('lg')]: {
                  fontSize: '24px',
                  padding: '32px',
                  minHeight: '124px'
                },
                '&:not(.Mui-selected):hover': {
                  backgroundColor: 'rgba(241, 241, 241, 0.5)'
                }
              }}
            />
          ))}
        </Tabs>
        <StyledTabPanels>
          {times.map((timeSchedule, index) => (
            <ScheduleTabPanel key={`schedule-tab-${index}`} value={value} index={index} times={timeSchedule} />
          ))}
        </StyledTabPanels>
      </StyledTabsWrapper>
    </StyledContainerContents>
  );
};

export default Schedule;
