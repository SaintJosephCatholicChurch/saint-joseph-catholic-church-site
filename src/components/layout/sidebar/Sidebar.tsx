import dynamic from 'next/dynamic';
import type { PostContent } from '../../../interface';
import styled from '../../../util/styled.util';
import SearchBox from '../../SearchBox';
import DailyReadings from '../../widgets/DailyReadings';
import RecentNews from '../../widgets/recent-news/RecentNews';

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

interface SidebarProps {
  recentPosts?: PostContent[];
  hideSearch?: boolean;
}

const Sidebar = ({ recentPosts, hideSearch = false }: SidebarProps) => {
  const UpcomingEventsNoSSR = dynamic(() => import('../../widgets/UpcomingEvents'), {
    ssr: false
  });

  return (
    <StyledSidebar>
      {!hideSearch ? (
        <StyledSection>
          <SearchBox disableMargin />
        </StyledSection>
      ) : null}
      <StyledSection>
        <DailyReadings />
      </StyledSection>
      {recentPosts?.length > 0 ? (
        <StyledSection>
          <RecentNews posts={recentPosts} />
        </StyledSection>
      ) : null}
      <StyledSection>
        <UpcomingEventsNoSSR />
      </StyledSection>
    </StyledSidebar>
  );
};

export default Sidebar;
