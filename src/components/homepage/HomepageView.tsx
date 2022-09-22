import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';
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

const StyledSectionWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px 0;
  position: relative;
`;

const StyledReadingsAndPageSectionWrapper = styled(StyledSectionWrapper)(
  ({ theme }) => `
    ${theme.breakpoints.down('md')} {
      padding: 16px 0;
    }
  `
);

const StyledNewsAndEventsWrapper = styled(StyledSectionWrapper)(
  ({ theme }) => `
    padding-bottom: 32px;

    ${theme.breakpoints.down('sm')} {
      padding-bottom: 40px;
    }

    ${theme.breakpoints.up('lg')} {
      padding-bottom: 48px;
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
  ({
    homePageData: { slides, schedule_section, live_stream_button, invitation_text, daily_readings, featured_page },
    times,
    recentPosts
  }: HomepageViewProps) => {
    const UpcomingEventsNoSSR = useMemo(
      () =>
        dynamic(() => import('../widgets/UpcomingEvents'), {
          ssr: false
        }),
      []
    );

    return (
      <StyledHomepageView>
        <CarouselView slides={slides} />
        <ScheduleWidget
          times={times}
          details={schedule_section}
          liveStreamButton={live_stream_button}
          invitationText={invitation_text}
        />
        <StyledReadingsAndPageSectionWrapper>
          <StyledDailyReadingsSectionBackground $background={daily_readings.daily_readings_background} />
          <Container>
            <StyledReadingsWidgetSectionContent>
              <DailyReadings dailyReadings={daily_readings} isFullWidth showSubtitle />
              <FeaturedPage featuredPage={featured_page} isFullWidth />
            </StyledReadingsWidgetSectionContent>
          </Container>
        </StyledReadingsAndPageSectionWrapper>
        <StyledNewsAndEventsWrapper>
          <Container>
            <StyledWidgetSectionContent>
              <RecentNews posts={recentPosts} size="large" />
              <UpcomingEventsNoSSR />
            </StyledWidgetSectionContent>
          </Container>
        </StyledNewsAndEventsWrapper>
        <Footer churchDetails={churchDetails} />
      </StyledHomepageView>
    );
  }
);

HomepageView.displayName = 'HomepageView';

export default HomepageView;
