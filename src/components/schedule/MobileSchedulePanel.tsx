import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { memo, useCallback, useState } from 'react';

import { getAdminPreviewFieldTargetProps } from '../../admin/content-sections/components/adminPreviewSelection';
import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../constants';
import getContainerQuery from '../../util/container.util';
import { isNotEmpty } from '../../util/string.util';
import transientOptions from '../../util/transientOptions';
import sanitizeHtmlImages from '../../util/sanitizeHtmlImages';

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

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
      padding: 12px 16px;
    }
  `
);

const StyledDayTimeLine = styled('div')`
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
`;

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

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      margin-bottom: 5px;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
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

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      gap: 6px;
      margin-bottom: 5px;
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

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
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

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
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
    text-wrap: balance;

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
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
  activePathKey?: string;
  times: Times;
  index: number;
}

const MobileScheduleTabPanel = memo(({ activePathKey, times, index }: MobileScheduleTabPanelProps) => {
  const [open, setOpen] = useState(index === 0);
  const categoryPath = buildCategoryPath(times.id);

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <StyledMobileScheduleTabPanel $open={open}>
      <ListItemButton
        {...getAdminPreviewFieldTargetProps(categoryPath)}
        onClick={handleClick}
        sx={getActivePreviewTargetStyle(categoryPath, activePathKey)}
      >
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
            const sectionNotePath = buildSectionPath(times.id, section.id, 'note');

            return (
              <StyledNoteWrapper key={`section-${section.id || sectionIndex}`}>
                <StyledNote
                  {...getAdminPreviewFieldTargetProps(sectionNotePath)}
                  style={getActivePreviewTargetStyle(sectionNotePath, activePathKey)}
                >
                  {section.note}
                </StyledNote>
              </StyledNoteWrapper>
            );
          }

          const sectionPath = buildSectionPath(times.id, section.id, 'name');

          return (
            <StyledSections
              key={`mobile-section-${section.id || sectionIndex}`}
              {...getAdminPreviewFieldTargetProps(sectionPath)}
              style={getActivePreviewTargetStyle(sectionPath, activePathKey)}
            >
              {isNotEmpty(section.name) ? <StyledSectionTitle>{section.name}</StyledSectionTitle> : null}
              {section.days?.map((day) => (
                <StyledDayTimeLine
                  key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}`}
                  {...getAdminPreviewFieldTargetProps(buildDayPath(times.id, section.id, day.id))}
                  style={getActivePreviewTargetStyle(buildDayPath(times.id, section.id, day.id), activePathKey)}
                >
                  <StyledDayTimeLineTitle>{day.day}</StyledDayTimeLineTitle>
                  {day.times?.length > 0 ? (
                    <StyledDayTimeLineTimes sx={{ marginLeft: '8px', marginBottom: '5px' }}>
                      <StyledDayTimeLineTimeWrapper
                        key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-times-0-first`}
                      >
                        {isNotEmpty(day.times[0].time) || isNotEmpty(day.times[0].end_time) ? (
                          <StyledDayTimeLineTime>
                            <StyledDayTimeLineTimeTimes
                              {...getAdminPreviewFieldTargetProps(
                                buildTimePath(times.id, section.id, day.id, day.times[0].id, 'time')
                              )}
                              style={getActivePreviewTargetStyle(
                                buildTimePath(times.id, section.id, day.id, day.times[0].id, 'time'),
                                activePathKey
                              )}
                            >
                              {isNotEmpty(day.times[0].time) ? day.times[0].time : null}
                            </StyledDayTimeLineTimeTimes>
                            {isNotEmpty(day.times[0].end_time) ? (
                              <>
                                <StyledDivider
                                  key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-divider-end-time-0-first`}
                                >
                                  -
                                </StyledDivider>
                                <StyledDayTimeLineTimeTimes
                                  key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-end-time-0-first`}
                                  {...getAdminPreviewFieldTargetProps(
                                    buildTimePath(times.id, section.id, day.id, day.times[0].id, 'end_time')
                                  )}
                                  style={getActivePreviewTargetStyle(
                                    buildTimePath(times.id, section.id, day.id, day.times[0].id, 'end_time'),
                                    activePathKey
                                  )}
                                >
                                  {day.times[0].end_time}
                                </StyledDayTimeLineTimeTimes>
                              </>
                            ) : null}
                          </StyledDayTimeLineTime>
                        ) : day.times[0].notes &&
                          day.times[0].notes.filter((note) => isNotEmpty(note.note)).length > 0 ? (
                          day.times[0].notes
                            .filter((note) => isNotEmpty(note.note))
                            .map((note) => (
                              <StyledDayTimeLineTimeComment
                                key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-note-${note.id}`}
                                {...getAdminPreviewFieldTargetProps(
                                  buildTimeNotePath(times.id, section.id, day.id, day.times[0].id, note.id)
                                )}
                                style={getActivePreviewTargetStyle(
                                  buildTimeNotePath(times.id, section.id, day.id, day.times[0].id, note.id),
                                  activePathKey
                                )}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtmlImages(note.note?.replaceAll('-', '&#x2011;'))
                                }}
                              ></StyledDayTimeLineTimeComment>
                            ))
                        ) : null}
                      </StyledDayTimeLineTimeWrapper>
                    </StyledDayTimeLineTimes>
                  ) : null}
                  <StyledDayTimeLineTimes sx={{ width: '100%' }}>
                    {day.times?.map((time, timeIndex) =>
                      timeIndex === 0 ? (
                        (isNotEmpty(time.time) || isNotEmpty(time.end_time)) &&
                        time.notes &&
                        time.notes.filter((note) => isNotEmpty(note.note)).length > 0 ? (
                          time.notes
                            .filter((note) => isNotEmpty(note.note))
                            .map((note) => (
                              <StyledDayTimeLineTimeComment
                                key={`mobile-section-${sectionIndex}-day-${day.day}-note-${note.id}`}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtmlImages(note.note?.replaceAll('-', '&#x2011;'))
                                }}
                              ></StyledDayTimeLineTimeComment>
                            ))
                        ) : null
                      ) : (
                        <StyledDayTimeLineTimeWrapper
                          key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-times-${time.id || timeIndex}`}
                        >
                          {isNotEmpty(time.time) || isNotEmpty(time.end_time) ? (
                            <StyledDayTimeLineTime>
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
                                    key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-divider-end-time-${time.id || timeIndex}`}
                                  >
                                    -
                                  </StyledDivider>
                                  <StyledDayTimeLineTimeTimes
                                    key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-end-time-${time.id || timeIndex}`}
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
                            </StyledDayTimeLineTime>
                          ) : null}
                          {time.notes && time.notes.filter((note) => isNotEmpty(note.note)).length > 0
                            ? time.notes
                                .filter((note) => isNotEmpty(note.note))
                                .map((note) => (
                                  <StyledDayTimeLineTimeComment
                                    key={`mobile-section-${section.id || sectionIndex}-day-${day.id || day.day}-note-${note.id}`}
                                    {...getAdminPreviewFieldTargetProps(
                                      buildTimeNotePath(times.id, section.id, day.id, time.id, note.id)
                                    )}
                                    style={getActivePreviewTargetStyle(
                                      buildTimeNotePath(times.id, section.id, day.id, time.id, note.id),
                                      activePathKey
                                    )}
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeHtmlImages(note.note?.replaceAll('-', '&#x2011;'))
                                    }}
                                  ></StyledDayTimeLineTimeComment>
                                ))
                            : null}
                        </StyledDayTimeLineTimeWrapper>
                      )
                    )}
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
