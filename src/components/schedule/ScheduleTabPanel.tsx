/* eslint-disable react/display-name */
import { styled, useTheme } from '@mui/material/styles';
import { memo } from 'react';
import { Times } from '../../interface';
import { isNotEmpty } from '../../util/string.util';
import TabPanel from '../TabPanel';

const StyledTabPanel = styled(TabPanel)`
  flex-direction: column;
  width: 100%;

  padding: 50px;
  @media screen and (max-width: 900px) {
    padding: 36px;
  }

  &:not([hidden]) {
    display: flex;
  }
`;

const StyledTabPanelTitleWrapper = styled('div')`
  display: flex;
`;

const StyledTabPanelTitle = styled('h2')`
  font-weight: 500;
  color: #333;
  padding: 0;
  padding-bottom: 16px;
  margin: 0;
  border-bottom: 2px solid #bbbbbb;
  text-transform: uppercase;

  font-size: 24px;
  line-height: 24px;
  @media screen and (min-width: 1200px) {
    font-size: 30px;
  }
`;

const StyledSectionTitle = styled('h3')`
  font-size: 20px;
  padding: 0;
  margin: 0;
  margin-bottom: 8px;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
`;

const StyledSections = styled('div')`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0;
`;

const StyledDayTimeLine = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 20px;
  margin-top: 2px;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
`;

const StyledDayTimeLineTitle = styled('div')`
  text-transform: uppercase;
  color: #d2ac54;
  font-weight: 500;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;

  font-size: 16px;
  @media screen and (max-width: 900px) {
    font-size: 14px;
    line-height: 16px;
  }
`;

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

const StyledDayTimeLineTimeTimes = styled('div')`
  text-transform: uppercase;

  font-size: 15px;
  @media screen and (max-width: 900px) {
    font-size: 14px;
    line-height: 16px;
  }
`;

const StyledDivider = styled('div')`
  color: #aaa;

  font-size: 15px;
  @media screen and (max-width: 900px) {
    font-size: 13px;
  }
`;

const StyledDayTimeLineTimeComment = styled('div')`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 13px;
  color: #777;
`;

interface ScheduleTabPanelProps {
  times: Times;
  value: number;
  index: number;
}

const ScheduleTabPanel = memo(({ times, value, index }: ScheduleTabPanelProps) => {
  const theme = useTheme();

  return (
    <StyledTabPanel value={value} index={index}>
      <StyledTabPanelTitleWrapper>
        <StyledTabPanelTitle>{times.name}</StyledTabPanelTitle>
      </StyledTabPanelTitleWrapper>
      {times.sections?.map((section) => (
        <StyledSections key={`section-${section.name}`}>
          <StyledSectionTitle>{section.name}</StyledSectionTitle>
          {section.days?.map((day) => (
            <StyledDayTimeLine key={`section-${section.name}-day-${day.day}`}>
              <StyledDayTimeLineTitle>{day.day}</StyledDayTimeLineTitle>
              <StyledDayTimeLineTimes>
                {day.times?.map((time, timeIndex) => (
                  <StyledDayTimeLineTime key={`section-${section.name}-day-${day.day}-times`}>
                    <StyledDayTimeLineTimeTimes>
                      {isNotEmpty(time.time) ? time.time : <div>&nbsp;</div>}
                    </StyledDayTimeLineTimeTimes>
                    {isNotEmpty(time.end_time) ? (
                      <>
                        <StyledDivider key={`section-${section.name}-day-${day.day}-divider-end-time-${timeIndex}`}>
                          -
                        </StyledDivider>
                        <StyledDayTimeLineTimeTimes
                          key={`section-${section.name}-day-${day.day}-end-time-${timeIndex}`}
                        >
                          {time.end_time}
                        </StyledDayTimeLineTimeTimes>
                      </>
                    ) : null}
                    {isNotEmpty(time.note) ? (
                      <StyledDayTimeLineTimeComment key={`section-${section.name}-day-${day.day}-note-${timeIndex}`}>
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
    </StyledTabPanel>
  );
});

export default ScheduleTabPanel;
