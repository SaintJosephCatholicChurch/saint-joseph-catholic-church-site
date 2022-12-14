import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { memo, useCallback, useState } from 'react';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../constants';
import { isNotEmpty } from '../../util/string.util';
import transientOptions from '../../util/transientOptions';

import type { Times } from '../../interface';

interface StyledMobileScheduleTabPanelProps {
  $open: boolean;
}

const StyledMobileScheduleTabPanel = styled(
  'div',
  transientOptions
)<StyledMobileScheduleTabPanelProps>(
  ({ $open }) => `
    background-color: ${$open ? '#ffffff' : '#f1f1f1'};
    border-bottom: 1px solid #ccc;
    width: 100%;
  `
);

const StyledSectionTitle = styled('h3')`
  font-size: 20px;
  padding: 0;
  margin: 0;
  margin-bottom: 8px;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
`;

const StyledSections = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
    padding: 16px 24px;
    box-sizing: border-box;

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      padding: 12px 16px;
    }
  `
);

const StyledDayTimeLine = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 20px;
    margin-top: 2px;
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
    gap: 8px;

    ${theme.breakpoints.down('sm')} {
      padding: 0;
      padding-top: 5px;
    }
  `
);

const StyledDayTimeLineTitle = styled('div')(
  ({ theme }) => `
    text-transform: uppercase;
    color: #8D6D26;
    font-weight: 500;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 16px;

    ${theme.breakpoints.down('sm')} {
      margin-bottom: 5px;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      font-size: 12px;
      line-height: 14px;
    }
  `
);

const StyledDayTimeLineTimes = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 4px;

    ${theme.breakpoints.down('sm')} {
      gap: 12px;
      flex-wrap: nowrap;
      white-space: nowrap;
    }
  `
);

const StyledDayTimeLineTimeWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    gap: 4px;

    ${theme.breakpoints.down('sm')} {
      flex-direction: column;
      align-items: flex-end;
    }
  `
);

const StyledDayTimeLineTime = styled('div')`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
`;

const StyledDayTimeLineTimeTimes = styled('div')(
  ({ theme }) => `
    text-transform: uppercase;
    font-size: 14px;
    line-height: 16px;

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      font-size: 12px;
      line-height: 14px;
    }
  `
);

const StyledDivider = styled('div')`
  color: #aaa;
  font-size: 13px;
`;

const StyledDayTimeLineTimeComment = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    font-size: 13px;
    line-height: 13px;
    color: #757575;

    ${theme.breakpoints.down('sm')} {
      margin-bottom: 5px;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      font-size: 12px;
      line-height: 12px;
    }
  `
);

interface MobileScheduleTabPanelProps {
  times: Times;
  index: number;
}

const MobileScheduleTabPanel = memo(({ times, index }: MobileScheduleTabPanelProps) => {
  const [open, setOpen] = useState(index === 0);

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <StyledMobileScheduleTabPanel $open={open}>
      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={times.name}
          primaryTypographyProps={{
            component: 'h2'
          }}
          sx={{
            '.MuiListItemText-primary': {
              fontWeight: 500,
              color: '#333',
              textTransform: 'uppercase',
              fontSize: '18px',
              lineHeight: '20px',
              fontFamily: "'Oswald', Helvetica, Arial, sans-serif"
            }
          }}
        />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {times.sections?.map((section, sectionIndex) => (
          <StyledSections key={`mobile-section-${sectionIndex}`}>
            {isNotEmpty(section.name) ? <StyledSectionTitle>{section.name}</StyledSectionTitle> : null}
            {section.days?.map((day) => (
              <StyledDayTimeLine key={`mobile-section-${sectionIndex}-day-${day.day}`}>
                <StyledDayTimeLineTitle>{day.day}</StyledDayTimeLineTitle>
                <StyledDayTimeLineTimes>
                  {day.times?.map((time, timeIndex) => (
                    <StyledDayTimeLineTimeWrapper
                      key={`mobile-section-${sectionIndex}-day-${day.day}-times-${timeIndex}`}
                    >
                      <StyledDayTimeLineTime>
                        <StyledDayTimeLineTimeTimes>
                          {isNotEmpty(time.time) ? time.time : null}
                        </StyledDayTimeLineTimeTimes>
                        {isNotEmpty(time.end_time) ? (
                          <>
                            <StyledDivider
                              key={`mobile-section-${sectionIndex}-day-${day.day}-divider-end-time-${timeIndex}`}
                            >
                              -
                            </StyledDivider>
                            <StyledDayTimeLineTimeTimes
                              key={`mobile-section-${sectionIndex}-day-${day.day}-end-time-${timeIndex}`}
                            >
                              {time.end_time}
                            </StyledDayTimeLineTimeTimes>
                          </>
                        ) : null}
                      </StyledDayTimeLineTime>
                      {isNotEmpty(time.note) ? (
                        <StyledDayTimeLineTimeComment
                          key={`mobile-section-${sectionIndex}-day-${day.day}-note-${timeIndex}`}
                        >
                          {time.note}
                        </StyledDayTimeLineTimeComment>
                      ) : null}
                    </StyledDayTimeLineTimeWrapper>
                  ))}
                </StyledDayTimeLineTimes>
              </StyledDayTimeLine>
            ))}
          </StyledSections>
        ))}
      </Collapse>
    </StyledMobileScheduleTabPanel>
  );
});

MobileScheduleTabPanel.displayName = 'MobileScheduleTabPanel';

export default MobileScheduleTabPanel;
