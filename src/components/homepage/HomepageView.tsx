import dynamic from 'next/dynamic';
import { memo } from 'react';
import type { HomePageData, PostContent, Times } from '../../interface';
import churchDetails from '../../lib/church_details';
import styled from '../../util/styled.util';
import CarouselView from '../carousel/CarouselView';
import Container from '../layout/Container';
import Footer from '../layout/footer/Footer';
import ScheduleWidget from '../schedule/ScheduleWidget';
import RecentNews from '../widgets/recent-news/RecentNews';

const StyledHomepageView = styled('div')`
  width: 100%;
  margin-top: 64px;
`;

const StyledWidgetsWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px 0;
`;

const StyledWidgetsContent = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 64px;

    ${theme.breakpoints.down('lg')} {
      gap: 40px;
    }

    ${theme.breakpoints.down('md')} {
      grid-template-columns: minmax(0, 1fr);
      gap: 32px;
    }
  `
);

interface HomepageViewProps {
  homePageData: HomePageData;
  times: Times[];
  recentPosts: PostContent[];
}

const HomepageView = memo(
  ({ homePageData: { slides, schedule_background }, times, recentPosts }: HomepageViewProps) => {
    const UpcomingEventsNoSSR = dynamic(() => import('../widgets/UpcomingEvents'), {
      ssr: false
    });

    return (
      <StyledHomepageView>
        <CarouselView slides={slides} />
        <ScheduleWidget times={times} background={schedule_background} />
        <StyledWidgetsWrapper>
          <Container>
            <StyledWidgetsContent>
              <RecentNews posts={recentPosts} size="large" />
              <UpcomingEventsNoSSR />
            </StyledWidgetsContent>
          </Container>
        </StyledWidgetsWrapper>
        <Footer churchDetails={churchDetails} />
      </StyledHomepageView>
    );
  }
);

HomepageView.displayName = 'HomepageView';

export default HomepageView;
