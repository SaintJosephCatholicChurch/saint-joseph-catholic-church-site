import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import type { HomePageData, PostContent, Times } from '../../interface';
import churchDetails from '../../lib/church_details';
import transientOptions from '../../util/transientOptions';
import CarouselView from '../carousel/CarouselView';
import Container from '../layout/Container';
import Footer from '../layout/footer/Footer';
import ScheduleWidget from '../schedule/ScheduleWidget';
import DailyReadings from '../widgets/DailyReadings';
import FeaturedPage from '../widgets/FeaturedPage';
import RecentNews from '../widgets/recent-news/RecentNews';

const StyledHomepageView = styled('div')`
  width: 100%;
  margin-top: 64px;
`;

const StyledSectionWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 24px 0;
    position: relative;

    ${theme.breakpoints.down('md')} {
      padding: 16px 0;
    }
  `
);

const StyledWidgetSectionContent = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 64px;
    width: 100%;

    ${theme.breakpoints.down('lg')} {
      gap: 48px;
    }

    ${theme.breakpoints.down('md')} {
      grid-template-columns: minmax(0, 1fr);
    }
  `
);

const StyledReadingsWidgetSectionContent = styled(StyledWidgetSectionContent)`
  margin: 16px 0;
`;

interface StyledDailyReadingsSectionBackgroundProps {
  $background: string;
}

const StyledDailyReadingsSectionBackground = styled(
  'div',
  transientOptions
)<StyledDailyReadingsSectionBackgroundProps>(
  ({ $background }) => `
    opacity: 0.6;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 140%;
    background: linear-gradient(rgba(241, 241, 241, 0) 25%, #f1f1f1 75%), url(${$background}), #f1f1f1;
    background-position: top center;
    background-size: cover;
    opacity: 0.25;
    pointer-events: none;
  `
);

interface HomepageViewProps {
  homePageData: HomePageData;
  times: Times[];
  recentPosts: PostContent[];
}

const HomepageView = memo(
  ({ homePageData: { slides, schedule_background, daily_readings_background, featured_page }, times, recentPosts }: HomepageViewProps) => {
    const UpcomingEventsNoSSR = dynamic(() => import('../widgets/UpcomingEvents'), {
      ssr: false
    });

    return (
      <StyledHomepageView>
        <CarouselView slides={slides} />
        <ScheduleWidget times={times} background={schedule_background} />
        <StyledSectionWrapper>
          <StyledDailyReadingsSectionBackground $background={daily_readings_background} />
          <Container>
            <StyledReadingsWidgetSectionContent>
              <DailyReadings isFullWidth showSubtitle />
              <FeaturedPage featuredPage={featured_page} isFullWidth />
            </StyledReadingsWidgetSectionContent>
          </Container>
        </StyledSectionWrapper>
        <StyledSectionWrapper>
          <Container>
            <StyledWidgetSectionContent>
              <RecentNews posts={recentPosts} size="large" />
              <UpcomingEventsNoSSR />
            </StyledWidgetSectionContent>
          </Container>
        </StyledSectionWrapper>
        <Footer churchDetails={churchDetails} />
      </StyledHomepageView>
    );
  }
);

HomepageView.displayName = 'HomepageView';

export default HomepageView;
