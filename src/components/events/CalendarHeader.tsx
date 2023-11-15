import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled, useTheme } from '@mui/material/styles';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addWeeks from 'date-fns/addWeeks';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { useCallback, useEffect, useMemo, useState } from 'react';

import getContainerQuery from '../../util/container.util';
import { formatAsUtc } from '../../util/date.util';
import { isEmpty } from '../../util/string.util';
import PageTitle from '../pages/PageTitle';

import type { CalendarApi } from '@fullcalendar/core';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { SxProps, Theme } from '@mui/material/styles';

const StyledCalendarHeader = styled('div')(
  ({ theme }) => `
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 0;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      justify-content: center;
      margin-bottom: 0;
      padding: 0 24px;
    }
  `
);

const StyledCalendarHeaderLeft = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 4px;
    align-items: center;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      display: none;
    }
  `
);

const StyledCalendarMobileSubHeader = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;

    ${getContainerQuery(theme.breakpoints.up('sm'))} {
      display: none;
    }
  `
);

const StyledCalendarMobileButtonWrapper = styled('div')`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const StyledTitle = styled('h2')(
  ({ theme }) => `
    margin: 0;
    margin-left: 16px;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      margin-left: 0;
      font-size: 18px;
    }
  `
);

const StyledSubHeader = styled('div')(
  ({ theme }) => `
    ${getContainerQuery(theme.breakpoints.up('sm'))} {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  `
);

const StyledViewSelectWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    gap: 4px;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      position: absolute;
      right: 24px;
      top: 0;
    }
  `
);

const StyledDatePicker = styled('div')(
  ({ theme }) => `
    width: 100%;

    .MuiCalendarPicker-root {
      max-width: 100%;
    }

    .MuiCalendarPicker-root > div:first-of-type {
      display: none;
    }

    .PrivatePickersSlideTransition-root {
      min-height: unset;
    }

    .MuiCalendarPicker-root .MuiTypography-caption {
      color: #333;
    }

    .MuiPickersDay-root {
      color: #222;
    }

    .MuiPickersDay-root.Mui-selected,
    .MuiPickersDay-root.Mui-selected:hover,
    .MuiPickersDay-root.Mui-selected:focus {
      background-color: #bc2f3b;
      color: #fff;
    }

    .MuiPickersDay-root:focus {
      background-color: rgba(188,47,59,0.12);
    }

    ${getContainerQuery(theme.breakpoints.up('sm'))} {
      display: none;
    }
  `
);

const StyledMobileDateTitleWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    margin-top: 16px;

    ${getContainerQuery(theme.breakpoints.up('sm'))} {
      display: none;
    }
  `
);

const StyledMobileDateTitle = styled('h3')`
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

interface CalendarHeaderProps {
  title: string;
  api: CalendarApi | undefined;
  isSmallScreen: boolean;
}

const CalendarHeader = ({ title, api, isSmallScreen }: CalendarHeaderProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState('dayGridMonth');
  const theme = useTheme();

  const handleViewChange = useCallback(
    (event: SelectChangeEvent) => {
      const newView = event.target.value;
      setView(newView);

      if (!isSmallScreen) {
        api?.changeView(newView, new Date());
      }
    },
    [api, isSmallScreen]
  );

  const isSmallScreenMonthView = useMemo(() => isSmallScreen && view === 'dayGridMonth', [isSmallScreen, view]);

  const handleTodayClick = useCallback(() => {
    setDate(new Date());
    api?.prev();
  }, [api]);

  const handlePreviousClick = useCallback(() => {
    if (view === 'dayGridMonth') {
      setDate(addMonths(date, -1));
    } else if (view === 'timeGridWeek') {
      setDate(addWeeks(date, -1));
    } else {
      setDate(addDays(date, -1));
    }
  }, [date, view]);

  const handleNextClick = useCallback(() => {
    if (view === 'dayGridMonth') {
      setDate(addMonths(date, 1));
    } else if (view === 'timeGridWeek') {
      setDate(addWeeks(date, 1));
    } else {
      setDate(addDays(date, 1));
    }
  }, [date, view]);

  useEffect(() => {
    if (date !== api?.getDate()) {
      api?.gotoDate(date);
    }
  }, [api, date, isSmallScreen]);

  const [monthOnlyTitle, longTitle] = useMemo(() => {
    if (isEmpty(title)) {
      return [title, title];
    }

    if (/^[a-z]+ [0-9]{4}$/gi.test(title) || title.includes('–') || title.includes('-')) {
      return [title, title];
    }

    const date = parse(title, 'MMMM d, yyyy', new Date());

    return [format(date, 'MMMM yyyy'), formatAsUtc(date, 'EEEE, MMMM d, yyyy')];
  }, [title]);

  const buttonStyles: SxProps<Theme> = useMemo(
    () => ({
      p: '8px 8px',
      minWidth: 'unset',
      backgroundColor: '#bc2f3b',
      '&:hover': {
        backgroundColor: '#cd3744'
      },
      [getContainerQuery(theme.breakpoints.down('sm'))]: {
        p: '4px 4px'
      }
    }),
    [theme.breakpoints]
  );

  const nextPreviousButtons = useMemo(
    () => (
      <>
        <Button onClick={handlePreviousClick} variant="contained" sx={buttonStyles}>
          <ChevronLeftIcon />
        </Button>
        <Button onClick={handleNextClick} variant="contained" sx={buttonStyles}>
          <ChevronRightIcon />
        </Button>
      </>
    ),
    [buttonStyles, handleNextClick, handlePreviousClick]
  );

  const renderedTitle = useMemo(
    () => <StyledTitle>{isSmallScreenMonthView ? monthOnlyTitle : title}</StyledTitle>,
    [isSmallScreenMonthView, monthOnlyTitle, title]
  );

  return (
    <StyledCalendarHeader>
      <PageTitle title="Events" />
      <StyledSubHeader>
        <StyledCalendarHeaderLeft>
          {nextPreviousButtons}
          {renderedTitle}
        </StyledCalendarHeaderLeft>
        <StyledViewSelectWrapper>
          <IconButton onClick={handleTodayClick}>
            <TodayIcon />
          </IconButton>
          <FormControl
            fullWidth
            sx={{
              width: '100px'
            }}
          >
            <Select labelId="view-select-label" id="view-select" value={view} onChange={handleViewChange} size="small">
              <MenuItem value="dayGridMonth">Month</MenuItem>
              <MenuItem
                value="timeGridWeek"
                sx={{ [getContainerQuery(theme.breakpoints.down('sm'))]: { display: 'none' } }}
              >
                Week
              </MenuItem>
              <MenuItem value="listDay">Day</MenuItem>
            </Select>
          </FormControl>
        </StyledViewSelectWrapper>
      </StyledSubHeader>
      {view === 'dayGridMonth' ? (
        <>
          <StyledCalendarMobileSubHeader>
            {renderedTitle}
            <StyledCalendarMobileButtonWrapper>{nextPreviousButtons}</StyledCalendarMobileButtonWrapper>
          </StyledCalendarMobileSubHeader>
          <StyledDatePicker>
            <DateCalendar
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
              }}
              sx={{ width: '280px' }}
            />
          </StyledDatePicker>
        </>
      ) : null}
      {view === 'listDay' ? (
        <StyledMobileDateTitle>
          {longTitle}
          <StyledCalendarMobileButtonWrapper>{nextPreviousButtons}</StyledCalendarMobileButtonWrapper>
        </StyledMobileDateTitle>
      ) : (
        <StyledMobileDateTitleWrapper>
          <StyledMobileDateTitle>{longTitle}</StyledMobileDateTitle>
        </StyledMobileDateTitleWrapper>
      )}
    </StyledCalendarHeader>
  );
};

export default CalendarHeader;
