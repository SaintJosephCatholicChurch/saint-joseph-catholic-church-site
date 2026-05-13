import { styled } from '@mui/material/styles';
import { memo } from 'react';

import { getAdminPreviewFieldTargetProps } from '../../admin/content-sections/components/adminPreviewSelection';
import getContainerQuery from '../../util/container.util';
import { isNotEmpty } from '../../util/string.util';
import transientOptions from '../../util/transientOptions';
import sanitizeHtmlImages from '../../util/sanitizeHtmlImages';
import TabPanel from '../TabPanel';

import type { Times } from '../../interface';
import type { CSSProperties } from 'react';

const ACTIVE_PREVIEW_TARGET_STYLE: CSSProperties = {
  backgroundColor: 'rgba(188, 47, 59, 0.1)',
  borderRadius: '4px',
  boxShadow: 'inset 0 0 0 1px rgba(127, 35, 44, 0.24)'
};

function getActivePreviewTargetStyle(pathKey: string | undefined, activePathKey?: string) {
  return pathKey && activePathKey === pathKey ? ACTIVE_PREVIEW_TARGET_STYLE : undefined;
}

function buildCategoryPath(categoryId?: string) {
  return categoryId ? `category|${categoryId}|name` : undefined;
}

function buildSectionPath(categoryId: string | undefined, sectionId: string | undefined, field: 'name' | 'note') {
  return categoryId && sectionId ? `section|${categoryId}|${sectionId}|${field}` : undefined;
}

function buildDayPath(categoryId: string | undefined, sectionId: string | undefined, dayId: string | undefined) {
  return categoryId && sectionId && dayId ? `day|${categoryId}|${sectionId}|${dayId}|day` : undefined;
}

function buildTimePath(
  categoryId: string | undefined,
  sectionId: string | undefined,
  dayId: string | undefined,
  timeId: string | undefined,
  field: 'end_time' | 'time'
) {
  return categoryId && sectionId && dayId && timeId
    ? `time|${categoryId}|${sectionId}|${dayId}|${timeId}|${field}`
    : undefined;
}

function buildTimeNotePath(
  categoryId: string | undefined,
  sectionId: string | undefined,
  dayId: string | undefined,
  timeId: string | undefined,
  noteId: string | undefined
) {
  return categoryId && sectionId && dayId && timeId && noteId
    ? `time-note|${categoryId}|${sectionId}|${dayId}|${timeId}|${noteId}|note`
    : undefined;
}

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
  activePathKey?: string;
  times: Times;
  value: number;
  index: number;
  disablePadding?: boolean;
  variant?: 'normal' | 'compact';
}

const ScheduleTabPanel = memo(
  ({ activePathKey, times, value, index, disablePadding = false, variant = 'normal' }: ScheduleTabPanelProps) => {
    const categoryPath = buildCategoryPath(times.id);

    return (
      <TabPanel value={value} index={index}>
        <StyledTabPanelContent $disablePadding={disablePadding}>
          <StyledTabPanelTitleWrapper>
            <StyledTabPanelTitle
              $variant={variant}
              {...getAdminPreviewFieldTargetProps(categoryPath)}
              style={getActivePreviewTargetStyle(categoryPath, activePathKey)}
            >
              {times.name}
            </StyledTabPanelTitle>
          </StyledTabPanelTitleWrapper>
          {times.sections?.map((section, sectionIndex) => {
            if ('note' in section) {
              const notePath = buildSectionPath(times.id, section.id, 'note');

              return (
                <StyledNote
                  key={`section-${section.id || sectionIndex}`}
                  {...getAdminPreviewFieldTargetProps(notePath)}
                  style={getActivePreviewTargetStyle(notePath, activePathKey)}
                >
                  {section.note}
                </StyledNote>
              );
            }

            const sectionPath = buildSectionPath(times.id, section.id, 'name');

            return (
              <StyledSections
                key={`section-${section.id || sectionIndex}`}
                $variant={variant}
                {...getAdminPreviewFieldTargetProps(sectionPath)}
                style={getActivePreviewTargetStyle(sectionPath, activePathKey)}
              >
                {isNotEmpty(section.name) ? <StyledSectionTitle>{section.name}</StyledSectionTitle> : null}
                {section.days?.map((day, dayIndex) => (
                  <StyledDayTimeLine
                    key={`section-${section.id || sectionIndex}-day-${day.id || dayIndex}`}
                    {...getAdminPreviewFieldTargetProps(buildDayPath(times.id, section.id, day.id))}
                    style={getActivePreviewTargetStyle(buildDayPath(times.id, section.id, day.id), activePathKey)}
                  >
                    <StyledDayTimeLineTitle>{day.day}</StyledDayTimeLineTitle>
                    <StyledDayTimeLineTimes>
                      {day.times?.map((time, timeIndex) => (
                        <StyledDayTimeLineTime
                          key={`section-${section.id || sectionIndex}-day-${day.id || dayIndex}-times-${time.id || timeIndex}`}
                          $inlineNotes={!isNotEmpty(time.end_time)}
                          {...getAdminPreviewFieldTargetProps(
                            buildTimePath(times.id, section.id, day.id, time.id, 'time')
                          )}
                          style={getActivePreviewTargetStyle(
                            buildTimePath(times.id, section.id, day.id, time.id, 'time'),
                            activePathKey
                          )}
                        >
                          <StyledDayTimeLineTimeTimes
                            {...getAdminPreviewFieldTargetProps(
                              buildTimePath(times.id, section.id, day.id, time.id, 'time')
                            )}
                            style={getActivePreviewTargetStyle(
                              buildTimePath(times.id, section.id, day.id, time.id, 'time'),
                              activePathKey
                            )}
                          >
                            {isNotEmpty(time.time) ? time.time : null}
                          </StyledDayTimeLineTimeTimes>
                          {isNotEmpty(time.end_time) ? (
                            <>
                              <StyledDivider
                                key={`section-${section.id || sectionIndex}-day-${day.id || dayIndex}-divider-end-time-${time.id || timeIndex}`}
                              >
                                -
                              </StyledDivider>
                              <StyledDayTimeLineTimeTimes
                                key={`section-${section.id || sectionIndex}-day-${day.id || dayIndex}-end-time-${time.id || timeIndex}`}
                                {...getAdminPreviewFieldTargetProps(
                                  buildTimePath(times.id, section.id, day.id, time.id, 'end_time')
                                )}
                                style={getActivePreviewTargetStyle(
                                  buildTimePath(times.id, section.id, day.id, time.id, 'end_time'),
                                  activePathKey
                                )}
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
                                    key={`section-${section.id || sectionIndex}-day-${day.id || dayIndex}-note-${note.id}`}
                                    {...getAdminPreviewFieldTargetProps(
                                      buildTimeNotePath(times.id, section.id, day.id, time.id, note.id)
                                    )}
                                    style={getActivePreviewTargetStyle(
                                      buildTimeNotePath(times.id, section.id, day.id, time.id, note.id),
                                      activePathKey
                                    )}
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
