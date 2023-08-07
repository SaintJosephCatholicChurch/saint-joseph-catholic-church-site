import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { memo, useCallback, useMemo } from 'react';

import churchDetails from '../../lib/church_details';
import config from '../../lib/config';
import transientOptions from '../../util/transientOptions';
import CarouselView from '../carousel/CarouselView';
import Container from '../layout/Container';
import Footer from '../layout/footer/Footer';
import ScheduleWidget from '../schedule/ScheduleWidget';
import DailyReadings from '../widgets/DailyReadings';
import FeaturedLinkView from '../widgets/FeaturedLink';
import FeaturedPageView from '../widgets/FeaturedPage';
import RecentNews from '../widgets/recent-news/RecentNews';

import type { FeaturedLink, FeaturedPage, HomePageData, PostContent, Times } from '../../interface';

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
    ${theme.breakpoints.down('md').replace("@media", "@container page")} {
      padding: 16px 0;
    }
  `
);

const StyledNewsAndEventsWrapper = styled(StyledSectionWrapper)(
  ({ theme }) => `
    padding-bottom: 32px;

    ${theme.breakpoints.down('sm').replace("@media", "@container page")} {
      padding-bottom: 40px;
    }

    ${theme.breakpoints.up('lg').replace("@media", "@container page")} {
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

    ${theme.breakpoints.down('lg').replace("@media", "@container page")} {
      gap: 48px;
    }

    ${theme.breakpoints.down('md').replace("@media", "@container page")} {
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

interface RenderFeatureOptions {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
}

interface HomepageViewProps {
  homePageData: HomePageData;
  times: Times[];
  recentPosts: PostContent[];
  hideSearch?: boolean;
}

const HomepageView = memo(
  ({
    homePageData: { slides, schedule_section, live_stream_button, invitation_text, daily_readings, featured },
    times,
    recentPosts,
    hideSearch
  }: HomepageViewProps) => {
    const UpcomingEventsNoSSR = useMemo(
      () =>
        dynamic(() => import('../widgets/UpcomingEvents'), {
          ssr: false
        }),
      []
    );

    const renderFeaturedLinkPage = useCallback(
      (featuredContent: FeaturedLink | FeaturedPage, index: number, options?: RenderFeatureOptions) => {
        const { hideOnMobile = false, hideOnNonMobile = false } = options ?? {};

        if (featuredContent.type === 'featured_link') {
          return (
            <FeaturedLinkView
              key={`page-${index}`}
              featuredLink={featuredContent}
              isFullWidth
              hideOnMobile={hideOnMobile}
              hideOnNonMobile={hideOnNonMobile}
            />
          );
        }
        return (
          <FeaturedPageView
            key={`page-${index}`}
            featuredPage={featuredContent}
            isFullWidth
            hideOnMobile={hideOnMobile}
            hideOnNonMobile={hideOnNonMobile}
          />
        );
      },
      []
    );

    const firstFeaturedLinkPage = useMemo(() => {
      if (featured.length === 0) {
        return null;
      }

      return renderFeaturedLinkPage(featured[0], 0);
    }, [featured, renderFeaturedLinkPage]);

    return (
      <StyledHomepageView>
        <CarouselView slides={slides} details={schedule_section} />
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
              {firstFeaturedLinkPage}
              {featured.map((featuredContent, index) => {
                if (index > 0) {
                  return renderFeaturedLinkPage(featuredContent, index, { hideOnNonMobile: true });
                }
                return null;
              })}
              <DailyReadings dailyReadings={daily_readings} isFullWidth showSubtitle />
              {featured.map((featuredContent, index) => {
                if (index > 0) {
                  return renderFeaturedLinkPage(featuredContent, index, { hideOnMobile: true });
                }
                return null;
              })}
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
        <Footer churchDetails={churchDetails} privacyPolicyLink={config.privacy_policy_url} hideSearch={hideSearch} />
      </StyledHomepageView>
    );
  }
);

HomepageView.displayName = 'HomepageView';

export default HomepageView;
