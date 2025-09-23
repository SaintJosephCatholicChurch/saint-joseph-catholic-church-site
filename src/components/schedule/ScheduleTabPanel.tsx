import { styled } from '@mui/material/styles';
import { memo } from 'react';

import getContainerQuery from '../../util/container.util';
import { isNotEmpty } from '../../util/string.util';
import transientOptions from '../../util/transientOptions';
import sanitizeHtmlImages from '../../util/sanitizeHtmlImages';
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

    ${getContainerQuery(theme.breakpoints.down('md'))} {
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

    ${getContainerQuery(theme.breakpoints.up('lg'))} {
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
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;

    margin-top: 32px;

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
  gap: 12px;
`;

const StyledDayTimeLineTitle = styled('div')(
  ({ theme }) => `
    text-transform: uppercase;
    color: #8D6D26;
    font-weight: 500;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;

    font-size: 17px;
    line-height: 21px;
    white-space: nowrap;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
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

interface StyledDayTimeLineTimeProps {
  $inlineNotes: boolean;
}

const StyledDayTimeLineTime = styled(
  'div',
  transientOptions
)<StyledDayTimeLineTimeProps>(
  ({ $inlineNotes }) => `
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    align-items: center;
    gap: ${$inlineNotes ? '12' : '4'}px;
  `
);

const StyledDayTimeLineTimeTimes = styled('div')(
  ({ theme }) => `
    text-transform: uppercase;
    white-space: nowrap;

    font-size: 15px;
    ${getContainerQuery(theme.breakpoints.down('md'))} {
      font-size: 14px;
      line-height: 16px;
    }
  `
);

const StyledDivider = styled('div')(
  ({ theme }) => `
    color: #aaa;

    font-size: 15px;
    ${getContainerQuery(theme.breakpoints.down('md'))} {
      font-size: 13px;
    }
  `
);

const StyledDayTimeLineTimeNotes = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;

const StyledDayTimeLineTimeComment = styled('div')`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 13px;
  color: #757575;
  text-align: right;
`;

const StyledNote = styled('div')`
  font-size: 13px;
  line-height: 13px;
  color: #757575;
  padding: 16px 0;
  white-space: break-spaces;
  text-align: right;
  width: 100%;
  box-sizing: border-box;

  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
`;

const NOTE_MAX_LINE_LENGTH = 45;

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
          {times.sections?.map((section, sectionIndex) => {
            if ('note' in section) {
              return <StyledNote key={`section-${sectionIndex}`}>{section.note}</StyledNote>;
            }

            return (
              <StyledSections key={`section-${sectionIndex}`} $variant={variant}>
                {isNotEmpty(section.name) ? <StyledSectionTitle>{section.name}</StyledSectionTitle> : null}
                {section.days?.map((day, dayIndex) => (
                  <StyledDayTimeLine key={`section-${sectionIndex}-day-${dayIndex}`}>
                    <StyledDayTimeLineTitle>{day.day}</StyledDayTimeLineTitle>
                    <StyledDayTimeLineTimes>
                      {day.times?.map((time, timeIndex) => (
                        <StyledDayTimeLineTime
                          key={`section-${sectionIndex}-day-${dayIndex}-times-${timeIndex}`}
                          $inlineNotes={!isNotEmpty(time.end_time)}
                        >
                          <StyledDayTimeLineTimeTimes>
                            {isNotEmpty(time.time) ? time.time : null}
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
                          {time.notes && time.notes.filter((note) => isNotEmpty(note.note)).length > 0 ? (
                            <StyledDayTimeLineTimeNotes>
                              {time.notes
                                .filter((note) => isNotEmpty(note.note))
                                .map((note) => (
                                  <StyledDayTimeLineTimeComment
                                    key={`section-${sectionIndex}-day-${dayIndex}-note-${note.id}`}
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeHtmlImages(
                                        note.note.replace(
                                          new RegExp(`(.{${NOTE_MAX_LINE_LENGTH}}(?:[^ ]*)[ ])`, 'g'),
                                          '$1<br>'
                                        )
                                      )
                                    }}
                                  />
                                ))}
                            </StyledDayTimeLineTimeNotes>
                          ) : null}
                        </StyledDayTimeLineTime>
                      ))}
                    </StyledDayTimeLineTimes>
                  </StyledDayTimeLine>
                ))}
              </StyledSections>
            );
          })}
        </StyledTabPanelContent>
      </TabPanel>
    );
  }
);

ScheduleTabPanel.displayName = 'ScheduleTabPanel';

export default ScheduleTabPanel;
