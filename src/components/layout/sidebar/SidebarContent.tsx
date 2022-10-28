import { styled } from '@mui/material/styles';
import { useLayoutEffect, useState } from 'react';

import { SMALL_BREAKPOINT } from '../../../constants';
import useWindowSize from '../../../util/useWindowSize';
import SearchBox from '../../SearchBox';
import DailyReadings from '../../widgets/DailyReadings';
import RecentNews from '../../widgets/recent-news/RecentNews';
import UpcomingEvents from '../../widgets/UpcomingEvents';

import type { DailyReadings as DailyReadingsDetails, PostContent } from '../../../interface';

const StyledSidebar = styled('div')(
  ({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;
    ${theme.breakpoints.down('md')} {
      display: none;
    }
  `
);

const StyledSection = styled('div')`
  border-bottom: 1px solid #adadad;
  padding-bottom: 32px;
`;

interface SidebarContentProps {
  recentPosts?: PostContent[];
  dailyReadings?: DailyReadingsDetails;
  hideSearch?: boolean;
}

const SidebarContent = ({ recentPosts, dailyReadings, hideSearch = false }: SidebarContentProps) => {
  const [shouldLoadSidebar, setShouldLoadSidebar] = useState(false);

  const { width } = useWindowSize();

  useLayoutEffect(() => {
    setShouldLoadSidebar(width > SMALL_BREAKPOINT);
  }, [width]);

  return shouldLoadSidebar ? (
    <StyledSidebar>
      {!hideSearch ? (
        <StyledSection key="search-section">
          <SearchBox value="" disableMargin />
        </StyledSection>
      ) : null}
      {dailyReadings ? (
        <StyledSection key="daily-readings-section">
          <DailyReadings dailyReadings={dailyReadings} />
        </StyledSection>
      ) : null}
      {recentPosts?.length > 0 ? (
        <StyledSection key="recent-posts-section">
          <RecentNews posts={recentPosts} />
        </StyledSection>
      ) : null}
      <StyledSection>
        <UpcomingEvents />
      </StyledSection>
    </StyledSidebar>
  ) : null;
};

export default SidebarContent;
