import LiveTvIcon from '@mui/icons-material/LiveTv';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../constants';
import { isNotEmpty } from '../../util/string.util';
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

    ${theme.breakpoints.down('md').replace("@media", "@container page")} {
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
    ${theme.breakpoints.up('lg').replace("@media", "@container page")} {
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

    ${theme.breakpoints.up('lg').replace("@media", "@container page")} {
      font-size: 30px;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT).replace("@media", "@container page")} {
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
    ${theme.breakpoints.down('md').replace("@media", "@container page")} {
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
                [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT).replace("@media", "@container page")]: {
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
              [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT).replace("@media", "@container page")]: {
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
          [theme.breakpoints.up('md').replace("@media", "@container page")]: {
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
                [theme.breakpoints.up('lg').replace("@media", "@container page")]: {
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
