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
    box-sizing: border-box;
    padding: 16px 24px;

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT).replace("@media", "@container page")} {
      padding: 12px 16px;
    }
  `
);

const StyledDayTimeLine = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: flex-start;
    min-height: 20px;
    margin-top: 2px;
    gap: 0;
    border-bottom: 1px solid #ccc;
    padding: 0;
    padding-top: 5px;
    flex-wrap: wrap;
    justify-content: flex-end;
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
    white-space: pre-line;
    flex-grow: 1;

    ${theme.breakpoints.down('sm').replace("@media", "@container page")} {
      margin-bottom: 5px;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT).replace("@media", "@container page")} {
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

    ${theme.breakpoints.down('sm').replace("@media", "@container page")} {
      gap: 8px;
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

    ${theme.breakpoints.down('sm').replace("@media", "@container page")} {
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

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT).replace("@media", "@container page")} {
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
    justify-content: end;
    align-items: center;
    font-size: 13px;
    line-height: 15px;
    color: #757575;
    white-space: pre-line;
    text-align: right;

    ${theme.breakpoints.down('sm').replace("@media", "@container page")} {
      margin-bottom: 5px;
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT).replace("@media", "@container page")} {
      font-size: 12px;
      line-height: 14px;
    }
  `
);

const StyledNoteWrapper = styled('div')`
  padding: 0 24px 16px;

  &:not(:last-child) div {
    border-bottom: 1px solid #ccc;
    padding-bottom: 16px;
  }
`;

const StyledNote = styled('div')`
  font-size: 13px;
  line-height: 15px;
  color: #757575;
  white-space: pre-line;
  padding-left: 16px;
  text-align: right;
`;

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
        {times.sections?.map((section, sectionIndex) => {
          if ('note' in section) {
            return (
              <StyledNoteWrapper key={`section-${sectionIndex}`}>
                <StyledNote>{section.note}</StyledNote>
              </StyledNoteWrapper>
            );
          }

          return (
            <StyledSections key={`mobile-section-${sectionIndex}`}>
              {isNotEmpty(section.name) ? <StyledSectionTitle>{section.name}</StyledSectionTitle> : null}
              {section.days?.map((day) => (
                <StyledDayTimeLine key={`mobile-section-${sectionIndex}-day-${day.day}`}>
                  <StyledDayTimeLineTitle>{day.day}</StyledDayTimeLineTitle>
                  {day.times?.length > 0 ? (
                    <StyledDayTimeLineTimes sx={{ marginLeft: '8px', marginBottom: '5px' }}>
                      <StyledDayTimeLineTimeWrapper
                        key={`mobile-section-${sectionIndex}-day-${day.day}-times-0-first`}
                      >
                        {isNotEmpty(day.times[0].time) || isNotEmpty(day.times[0].end_time) ? (
                          <StyledDayTimeLineTime>
                            <StyledDayTimeLineTimeTimes>
                              {isNotEmpty(day.times[0].time) ? day.times[0].time : null}
                            </StyledDayTimeLineTimeTimes>
                            {isNotEmpty(day.times[0].end_time) ? (
                              <>
                                <StyledDivider
                                  key={`mobile-section-${sectionIndex}-day-${day.day}-divider-end-time-0-first`}
                                >
                                  -
                                </StyledDivider>
                                <StyledDayTimeLineTimeTimes
                                  key={`mobile-section-${sectionIndex}-day-${day.day}-end-time-0-first`}
                                >
                                  {day.times[0].end_time}
                                </StyledDayTimeLineTimeTimes>
                              </>
                            ) : null}
                          </StyledDayTimeLineTime>
                        ) : (
                          <StyledDayTimeLineTimeComment
                            key={`mobile-section-${sectionIndex}-day-${day.day}-note-0-first`}
                            dangerouslySetInnerHTML={{
                              __html: day.times[0].note?.replaceAll('-', '&#x2011;')
                            }}
                          ></StyledDayTimeLineTimeComment>
                        )}
                      </StyledDayTimeLineTimeWrapper>
                    </StyledDayTimeLineTimes>
                  ) : null}
                  <StyledDayTimeLineTimes sx={{ width: '100%' }}>
                    {day.times?.map((time, timeIndex) => timeIndex === 0 ? (
                      (isNotEmpty(time.time) || isNotEmpty(time.end_time)) && isNotEmpty(time.note) ? (
                        <StyledDayTimeLineTimeComment
                          key={`mobile-section-${sectionIndex}-day-${day.day}-note-0-second`}
                          dangerouslySetInnerHTML={{
                            __html: time.note?.replaceAll('-', '&#x2011;')
                          }}
                        ></StyledDayTimeLineTimeComment>
                      ) : null
                    ) : (
                      <StyledDayTimeLineTimeWrapper
                        key={`mobile-section-${sectionIndex}-day-${day.day}-times-${timeIndex}`}
                      >
                        {isNotEmpty(time.time) || isNotEmpty(time.end_time) ? (
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
                        ) : null}
                        {isNotEmpty(time.note) ? (
                          <StyledDayTimeLineTimeComment
                            key={`mobile-section-${sectionIndex}-day-${day.day}-note-${timeIndex}`}
                            dangerouslySetInnerHTML={{
                              __html: time.note?.replaceAll('-', '&#x2011;')
                            }}
                          ></StyledDayTimeLineTimeComment>
                        ) : null}
                      </StyledDayTimeLineTimeWrapper>
                    ))}
                  </StyledDayTimeLineTimes>
                </StyledDayTimeLine>
              ))}
            </StyledSections>
          );
        })}
      </Collapse>
    </StyledMobileScheduleTabPanel>
  );
});

MobileScheduleTabPanel.displayName = 'MobileScheduleTabPanel';

export default MobileScheduleTabPanel;
