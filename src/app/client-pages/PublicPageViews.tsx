'use client';

import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import escapeRegExp from 'lodash/escapeRegExp';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import contentStyles from '../../../public/styles/content.module.css';
import { EXTRA_EXTRA_SMALL_BREAKPOINT, SEARCH_RESULTS_TO_SHOW } from '../../constants';
import { MAX_APP_WIDTH } from '../../constants';
import AppPageShell from '../AppPageShell';
import MobileScheduleTabPanel from '../../components/schedule/MobileSchedulePanel';
import ScheduleTabPanel from '../../components/schedule/ScheduleTabPanel';
import ContactView from '../../components/pages/custom/contact/ContactView';
import AskForm from '../../components/pages/custom/ask/AskForm';
import StaffView from '../../components/pages/custom/staff/StaffView';
import SearchResult from '../../components/search/SearchResult';
import SearchBox from '../../components/SearchBox';
import PageContentView from '../../components/pages/PageContentView';
import ParishRegistrationView from '../../components/pages/custom/parish-membership/ParishRegistrationView';
import LiveStreamView from '../../components/pages/custom/live-stream/LiveStreamView';
import churchDetails from '../../lib/church_details';
import staff from '../../lib/staff';
import times from '../../lib/times';
import useElementSize from '../../util/useElementSize';
import getContainerQuery from '../../util/container.util';
import { isNotEmpty } from '../../util/string.util';
import { useSearchScores } from '../../util/search.util';
import sanitizeHtmlImages from '../../util/sanitizeHtmlImages';
import Help from '../../cms/pages/help/Help';

import type { SidebarProps } from '../../lib/sidebar';
import type { ContentPageProps, SearchPageProps } from '../routeData';
import type { SearchableEntry } from '../../interface';

const StyledTimes = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 72px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      display: none;
    }
  `
);

const StyledDetails = styled('div')`
  margin-bottom: 32px;
`;

const StyledSearch = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StyledSearchQueryTitle = styled('h2')`
  color: #bf303c;
  margin-top: 0;
  margin-bottom: 32px;
`;

const StyledLiveStreamPageContent = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: ${MAX_APP_WIDTH - 48}px;

    ${getContainerQuery(theme.breakpoints.only('md'))} {
      max-width: calc(100vw - 64px);
    }

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      max-width: calc(100vw - 48px);
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
      max-width: calc(100vw - 24px);
    }
  `
);

function getLongestMatch(entry: SearchableEntry, escapedQuery: string) {
  let biggestMatch = '';
  let match: RegExpExecArray | null;

  const regex = new RegExp(
    `(?:[\\s]+[^\\s]+){0,10}[\\s]*${escapedQuery
      .split(' ')
      .join('|')}(?![^<>]*(([/"']|]]|\\b)>))[\\s]*(?:[^\\s]+\\s){0,25}`,
    'ig'
  );

  do {
    match = regex.exec(entry.content);
    if (match && match.length > 0 && biggestMatch.length < match[0].length) {
      biggestMatch = match[0];
    }
  } while (match);

  return biggestMatch;
}

export const ContentPageView = ({
  title,
  dateString: _dateString,
  slug: _slug,
  content,
  ...sidebarProps
}: ContentPageProps) => {
  return (
    <AppPageShell title={title} recentPosts={sidebarProps.recentPosts} dailyReadings={sidebarProps.dailyReadings}>
      <PageContentView>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtmlImages(content)
          }}
        />
      </PageContentView>
    </AppPageShell>
  );
};

const SearchPageResults = ({ searchableEntries }: SearchPageProps) => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const escapedQuery = useMemo(() => escapeRegExp(query), [query]);
  const searchResults = useSearchScores(escapedQuery, searchableEntries);

  return (
    <>
      <StyledSearchQueryTitle>
        {isNotEmpty(query) ? <SearchBox value={query} disableMargin /> : null}
      </StyledSearchQueryTitle>
      <StyledSearch>
        {searchResults?.length > 0 ? (
          [...Array<unknown>(SEARCH_RESULTS_TO_SHOW)].map((_, index) => {
            if (searchResults.length <= index) {
              return null;
            }

            const entry = searchResults[index];
            let { summary, showSummary = true } = entry;

            if (!summary && showSummary) {
              const match = new RegExp(
                `(?:[\\s]+[^\\s]+){0,10}[\\s]*${escapedQuery}(?![^<>]*(([/"']|]]|\\b)>))[\\s]*(?:[^\\s]+\\s){0,25}`,
                'ig'
              ).exec(entry.content);

              if (match && match.length >= 1) {
                summary = `...${match[0].trim()}...`;
              } else {
                summary = `...${getLongestMatch(entry, escapedQuery)}...`;
              }
            }

            summary = summary?.replace(
              new RegExp(`(${escapedQuery.split(' ').join('|')})(?![^<>]*(([/"']|]]|\\b)>))`, 'ig'),
              '<strong style="color: #000">$1</strong>'
            );

            return <SearchResult key={`result-${entry.url}`} entry={entry} summary={summary} />;
          })
        ) : isNotEmpty(query) ? (
          <h3 key="no-results">No results found</h3>
        ) : null}
      </StyledSearch>
    </>
  );
};

export const SearchPageView = ({ searchableEntries }: SearchPageProps) => {
  return (
    <AppPageShell title="Search" hideSearch>
      <Suspense fallback={null}>
        <SearchPageResults searchableEntries={searchableEntries} />
      </Suspense>
    </AppPageShell>
  );
};

export const MassConfessionTimesPageView = ({ ...sidebarProps }: SidebarProps) => {
  const theme = useTheme();

  return (
    <AppPageShell
      title="Mass & Confession Times"
      recentPosts={sidebarProps.recentPosts}
      dailyReadings={sidebarProps.dailyReadings}
      hideHeader
    >
      <List
        component="div"
        aria-labelledby="nested-list-subheader"
        disablePadding
        sx={{
          width: '100%',
          [getContainerQuery(theme.breakpoints.up('md'))]: {
            display: 'none'
          }
        }}
      >
        {times.map((timeSchedule, index) => (
          <MobileScheduleTabPanel key={`mobile-schedule-panel-${index}`} times={timeSchedule} index={index} />
        ))}
      </List>
      <StyledTimes>
        {times.map((timeSchedule, index) => (
          <ScheduleTabPanel
            key={`schedule-tab-${index}`}
            value={index}
            index={index}
            times={timeSchedule}
            disablePadding
            variant="compact"
          />
        ))}
      </StyledTimes>
    </AppPageShell>
  );
};

export const StaffPageView = ({ ...sidebarProps }: SidebarProps) => {
  return (
    <AppPageShell
      title="Parish Staff"
      recentPosts={sidebarProps.recentPosts}
      dailyReadings={sidebarProps.dailyReadings}
    >
      <StaffView staff={staff} />
    </AppPageShell>
  );
};

export const HelpPageView = () => {
  return <Help />;
};

export const ContactPageView = () => {
  return (
    <AppPageShell title="Contact" hideSidebar hideHeader fullWidth disableBottomMargin>
      <ContactView churchDetails={churchDetails} />
    </AppPageShell>
  );
};

export const AskPageView = ({ ...sidebarProps }: SidebarProps) => {
  return (
    <AppPageShell
      title="Did You Know? Question Submission"
      recentPosts={sidebarProps.recentPosts}
      dailyReadings={sidebarProps.dailyReadings}
    >
      <StyledDetails className={contentStyles.content}>
        <p>
          Do you have a question regarding the Catholic Faith that you would like answered as a part of our Did You
          Know? Campaign?
        </p>
        <p>To ask a question, fill in the request form below.</p>
      </StyledDetails>
      <AskForm />
    </AppPageShell>
  );
};

export const ParishRegistrationPageView = ({ ...sidebarProps }: SidebarProps) => {
  return (
    <AppPageShell
      title="Parish Membership"
      recentPosts={sidebarProps.recentPosts}
      dailyReadings={sidebarProps.dailyReadings}
    >
      <ParishRegistrationView />
    </AppPageShell>
  );
};

export const LiveStreamPageView = ({ ...sidebarProps }: SidebarProps) => {
  const [ref, { width }] = useElementSize();

  return (
    <AppPageShell title="Live Stream" recentPosts={sidebarProps.recentPosts} dailyReadings={sidebarProps.dailyReadings}>
      <StyledLiveStreamPageContent ref={ref}>
        <LiveStreamView facebookPage={churchDetails.facebook_page} width={width} />
      </StyledLiveStreamPageContent>
    </AppPageShell>
  );
};

export const EventsPageView = () => {
  const CalendarViewNoSSR = useMemo(
    () =>
      dynamic(() => import('../../components/events/CalendarView'), {
        ssr: false
      }),
    []
  );

  return (
    <AppPageShell title="Events" hideHeader hideSidebar disablePadding>
      <CalendarViewNoSSR />
    </AppPageShell>
  );
};
