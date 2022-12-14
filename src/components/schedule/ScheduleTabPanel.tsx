import { styled } from '@mui/material/styles';
import { memo } from 'react';

import { isNotEmpty } from '../../util/string.util';
import transientOptions from '../../util/transientOptions';
import TabPanel from '../TabPanel';

import type { Times } from '../../interface';

interface StyledTabPanelContentProps {
  $disablePadding: boolean;
}

const StyledTabPanelContent = styled(
  'div',
  transientOptions
)<StyledTabPanelContentProps>(
  ({ theme, $disablePadding }) => `
    flex-direction: column;
    width: 100%;
    ${!$disablePadding ? 'padding: 50px;' : ''}
    box-sizing: border-box;

    ${theme.breakpoints.down('md')} {
      padding: 36px;
    }

    &:not([hidden]) {
      display: flex;
    }
  `
);

const StyledTabPanelTitleWrapper = styled('div')`
  display: flex;
`;

interface StyledTabPanelTitleProps {
  $variant: 'normal' | 'compact';
}

const StyledTabPanelTitle = styled(
  'h2',
  transientOptions
)<StyledTabPanelTitleProps>(
  ({ theme, $variant }) => `
    font-weight: 500;
    color: #555;
    padding: 0;
    margin: 0;
    text-transform: uppercase;

    ${
      $variant === 'normal'
        ? `
          padding-bottom: 16px;
          border-bottom: 2px solid #ddd;
        `
        : ''
    }

    font-size: 24px;
    line-height: 24px;

    ${theme.breakpoints.up('lg')} {
      font-size: 30px;
    }
  `
);

const StyledSectionTitle = styled('h3')`
  font-size: 20px;
  padding: 0;
  margin: 0;
  margin-bottom: 8px;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
`;

interface StyledSectionsProps {
  $variant: 'normal' | 'compact';
}

const StyledSections = styled(
  'div',
  transientOptions
)<StyledSectionsProps>(
  ({ $variant }) => `
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;

    ${
      $variant === 'compact'
        ? `
          &:nth-of-type(2) {
            margin-top: 24px;
          }
        `
        : ''
    }
  `
);

const StyledDayTimeLine = styled('div')`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 20px;
  margin-top: 2px;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
`;

const StyledDayTimeLineTitle = styled('div')(
  ({ theme }) => `
    text-transform: uppercase;
    color: #8D6D26;
    font-weight: 500;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;

    font-size: 17px;
    line-height: 21px;

    ${theme.breakpoints.down('md')} {
      font-size: 15px;
      line-height: 18px;
    }
  `
);

const StyledDayTimeLineTimes = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledDayTimeLineTime = styled('div')`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
`;

const StyledDayTimeLineTimeTimes = styled('div')(
  ({ theme }) => `
    text-transform: uppercase;

    font-size: 15px;
    ${theme.breakpoints.down('md')} {
      font-size: 14px;
      line-height: 16px;
    }
  `
);

const StyledDivider = styled('div')(
  ({ theme }) => `
    color: #aaa;

    font-size: 15px;
    ${theme.breakpoints.down('md')} {
      font-size: 13px;
    }
  `
);

const StyledDayTimeLineTimeComment = styled('div')`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 13px;
  color: #757575;
`;

interface ScheduleTabPanelProps {
  times: Times;
  value: number;
  index: number;
  disablePadding?: boolean;
  variant?: 'normal' | 'compact';
}

const ScheduleTabPanel = memo(
  ({ times, value, index, disablePadding = false, variant = 'normal' }: ScheduleTabPanelProps) => {
    return (
      <TabPanel value={value} index={index}>
        <StyledTabPanelContent $disablePadding={disablePadding}>
          <StyledTabPanelTitleWrapper>
            <StyledTabPanelTitle $variant={variant}>{times.name}</StyledTabPanelTitle>
          </StyledTabPanelTitleWrapper>
          {times.sections?.map((section, sectionIndex) => (
            <StyledSections key={`section-${sectionIndex}`} $variant={variant}>
              {isNotEmpty(section.name) ? <StyledSectionTitle>{section.name}</StyledSectionTitle> : null}
              {section.days?.map((day, dayIndex) => (
                <StyledDayTimeLine key={`section-${sectionIndex}-day-${dayIndex}`}>
                  <StyledDayTimeLineTitle>{day.day}</StyledDayTimeLineTitle>
                  <StyledDayTimeLineTimes>
                    {day.times?.map((time, timeIndex) => (
                      <StyledDayTimeLineTime key={`section-${sectionIndex}-day-${dayIndex}-times-${timeIndex}`}>
                        <StyledDayTimeLineTimeTimes>
                          {isNotEmpty(time.time) ? time.time : <div>&nbsp;</div>}
                        </StyledDayTimeLineTimeTimes>
                        {isNotEmpty(time.end_time) ? (
                          <>
                            <StyledDivider
                              key={`section-${sectionIndex}-day-${dayIndex}-divider-end-time-${timeIndex}`}
                            >
                              -
                            </StyledDivider>
                            <StyledDayTimeLineTimeTimes
                              key={`section-${sectionIndex}-day-${dayIndex}-end-time-${timeIndex}`}
                            >
                              {time.end_time}
                            </StyledDayTimeLineTimeTimes>
                          </>
                        ) : null}
                        {isNotEmpty(time.note) ? (
                          <StyledDayTimeLineTimeComment
                            key={`section-${sectionIndex}-day-${dayIndex}-note-${timeIndex}`}
                          >
                            {time.note}
                          </StyledDayTimeLineTimeComment>
                        ) : null}
                      </StyledDayTimeLineTime>
                    ))}
                  </StyledDayTimeLineTimes>
                </StyledDayTimeLine>
              ))}
            </StyledSections>
          ))}
        </StyledTabPanelContent>
      </TabPanel>
    );
  }
);

ScheduleTabPanel.displayName = 'ScheduleTabPanel';

export default ScheduleTabPanel;
