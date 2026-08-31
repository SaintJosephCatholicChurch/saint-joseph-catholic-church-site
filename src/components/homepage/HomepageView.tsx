import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo, useCallback, useMemo } from 'react';

import {
  EXTRA_EXTRA_SMALL_BREAKPOINT,
  EXTRA_SMALL_BREAKPOINT,
  LARGE_BREAKPOINT,
  SMALL_BREAKPOINT
} from '../../constants';
import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';
import CarouselView from '../carousel/CarouselView';
import {
  getActiveAdminPreviewTargetStyle,
  getAdminPreviewFieldTargetProps
} from '../common/adminPreviewTarget';
import Container from '../layout/Container';
import Footer from '../layout/footer/Footer';
import ScheduleWidget from '../schedule/ScheduleWidget';
import DailyReadings from '../widgets/DailyReadings';
import FeaturedLinkView from '../widgets/FeaturedLink';
import FeaturedPageView from '../widgets/FeaturedPage';
import RecentNews from '../widgets/recent-news/RecentNews';

import type { ChurchDetails, FeaturedLink, FeaturedPage, HomePageData, PostContent, Times } from '../../interface';

const StyledHomepageView = styled('div')`
  width: 100%;
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
    ${getContainerQuery(theme.breakpoints.down('md'))} {
      padding: 16px 0;
    }
  `
);

const StyledNewsletterSignupSectionWrapper = styled(StyledSectionWrapper)`
  padding-bottom: 28px;
  background-color: rgba(232, 229, 225, 0.5);
`;

const StyledNewsletterSignupSectionContent = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-grow: 1;
`;

const StyledNewsletterBanner = styled('div')(
  ({ theme }) => `
    display: grid;
    width: 100%;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      gap: 32px;
      grid-template-columns: minmax(0, 1fr);
    }
  `
);

const StyledNewsletterBannerTitles = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      align-items: center;
    }
  `
);

const StyledNewsletterBannerTitle = styled('h2')(
  ({ theme }) => `
    font-size: 42px;
    margin: 0;
    color: #bc2f3b;
    text-transform: uppercase;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;
    font-weight: bold;
    line-height: 48px;

    ${getContainerQuery(theme.breakpoints.down(LARGE_BREAKPOINT))} {
      font-size: 36px;
      line-height: 48px;
    }

    ${getContainerQuery(theme.breakpoints.down(SMALL_BREAKPOINT))} {
      font-size: 32px;
      line-height: unset;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_SMALL_BREAKPOINT))} {
      font-size: 28px;
      line-height: unset;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
      font-size: 24px;
      line-height: unset;
    }
  `
);

const StyledNewsletterBannerSubtitle = styled('h3')(
  ({ theme }) => `
    font-size: 32px;
    margin: 0;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;
    font-weight: bold;
    line-height: 36px;

    ${getContainerQuery(theme.breakpoints.down(LARGE_BREAKPOINT))} {
      font-size: 28px;
      line-height: 36px;
    }

    ${getContainerQuery(theme.breakpoints.down(SMALL_BREAKPOINT))} {
      font-size: 24px;
      line-height: unset;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_SMALL_BREAKPOINT))} {
      font-size: 20px;
      line-height: unset;
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))} {
      font-size: 18px;
      line-height: unset;
    }
  `
);

const StyledNewsletterSignupButtonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledNewsAndEventsWrapper = styled(StyledSectionWrapper)(
  ({ theme }) => `
    padding-bottom: 32px;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      padding-bottom: 40px;
    }

    ${getContainerQuery(theme.breakpoints.up('lg'))} {
      padding-bottom: 48px;
    }
  `
);

const StyledWidgetsContent = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 64px;
    width: 100%;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      gap: 48px;
    }

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      grid-template-columns: minmax(0, 1fr);
    }
  `
);

const StyledWidgetSectionContent = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 64px;
    width: 100%;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      gap: 48px;
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

export interface HomepageViewAdminSelection {
  activeFieldKey?: string;
  createFeaturedFieldKey?: (clientId: string, field: string) => string;
  createSlideFieldKey?: (clientId: string, field: string) => string;
  dailyReadingsBackgroundFieldKey?: string;
  dailyReadingsSubtitleFieldKey?: string;
  dailyReadingsTitleFieldKey?: string;
  invitationTextFieldKey?: string;
  liveStreamButtonFieldKey?: string;
  newsletterBannerSubtitleFieldKey?: string;
  newsletterBannerTitleFieldKey?: string;
  newsletterSignupButtonTextFieldKey?: string;
  newsletterSignupLinkFieldKey?: string;
  scheduleTitleFieldKey?: string;
}

interface HomepageViewProps {
  adminSelection?: HomepageViewAdminSelection;
  churchDetails: ChurchDetails;
  homePageData: HomePageData;
  privacyPolicyUrl: string;
  times: Times[];
  recentPosts: PostContent[];
  hideSearch?: boolean;
}

const HomepageView = memo(
  ({
    adminSelection,
    churchDetails,
    homePageData: {
      slides,
      schedule_section,
      live_stream_button,
      invitation_text,
      daily_readings,
      featured,
      newsletter
    },
    privacyPolicyUrl,
    times,
    recentPosts,
    hideSearch
  }: HomepageViewProps) => {
    const theme = useTheme();

    const UpcomingEventsNoSSR = useMemo(
      () =>
        dynamic(() => import('../widgets/UpcomingEvents'), {
          ssr: false
        }),
      []
    );

    const renderFeaturedLinkPage = useCallback(
      (featuredContent: FeaturedLink | FeaturedPage, index: number) => {
        const featuredId = featuredContent.clientId || String(index);
        const createFeaturedFieldKey = adminSelection?.createFeaturedFieldKey;

        if (featuredContent.type === 'featured_link') {
          return (
            <FeaturedLinkView
              key={featuredId}
              activeFieldKey={adminSelection?.activeFieldKey}
              imageFieldKey={createFeaturedFieldKey?.(featuredId, 'image')}
              summaryFieldKey={createFeaturedFieldKey?.(featuredId, 'summary')}
              titleFieldKey={createFeaturedFieldKey?.(featuredId, 'title')}
              featuredLink={featuredContent}
              isFullWidth
            />
          );
        }
        return (
          <FeaturedPageView
            key={featuredId}
            activeFieldKey={adminSelection?.activeFieldKey}
            imageFieldKey={createFeaturedFieldKey?.(featuredId, 'image')}
            pageSlugFieldKey={createFeaturedFieldKey?.(featuredId, 'pageSlug')}
            pageTitleFieldKey={createFeaturedFieldKey?.(featuredId, 'pageTitle')}
            summaryFieldKey={createFeaturedFieldKey?.(featuredId, 'summary')}
            featuredPage={featuredContent}
            isFullWidth
          />
        );
      },
      [adminSelection?.activeFieldKey, adminSelection?.createFeaturedFieldKey]
    );

    return (
      <StyledHomepageView>
        <CarouselView
          activeFieldKey={adminSelection?.activeFieldKey}
          createSlideFieldKey={adminSelection?.createSlideFieldKey}
          inCMS={Boolean(adminSelection)}
          slides={slides}
          details={schedule_section}
        />
        <ScheduleWidget
          homepageAdminSelection={
            adminSelection
              ? {
                  activeFieldKey: adminSelection.activeFieldKey,
                  invitationTextFieldKey: adminSelection.invitationTextFieldKey,
                  liveStreamButtonFieldKey: adminSelection.liveStreamButtonFieldKey,
                  massTimesTarget: true,
                  scheduleTitleFieldKey: adminSelection.scheduleTitleFieldKey
                }
              : undefined
          }
          inCMS={Boolean(adminSelection)}
          times={times}
          details={schedule_section}
          liveStreamButton={live_stream_button}
          invitationText={invitation_text}
          facebookPage={churchDetails.facebook_page}
        />
        <StyledReadingsAndPageSectionWrapper
          {...getAdminPreviewFieldTargetProps(adminSelection?.dailyReadingsBackgroundFieldKey)}
          style={getActiveAdminPreviewTargetStyle(
            adminSelection?.dailyReadingsBackgroundFieldKey,
            adminSelection?.activeFieldKey
          )}
        >
          <StyledDailyReadingsSectionBackground $background={daily_readings.daily_readings_background} />
          <Container>
            <StyledReadingsWidgetSectionContent>
              {featured.map((featuredContent, index) => renderFeaturedLinkPage(featuredContent, index))}
              <DailyReadings
                activeFieldKey={adminSelection?.activeFieldKey}
                backgroundFieldKey={adminSelection?.dailyReadingsBackgroundFieldKey}
                dailyReadings={daily_readings}
                isFullWidth
                showSubtitle
                subtitleFieldKey={adminSelection?.dailyReadingsSubtitleFieldKey}
                titleFieldKey={adminSelection?.dailyReadingsTitleFieldKey}
              />
            </StyledReadingsWidgetSectionContent>
          </Container>
        </StyledReadingsAndPageSectionWrapper>
        <StyledNewsletterSignupSectionWrapper>
          <Container>
            <StyledNewsletterSignupSectionContent>
              <StyledNewsletterBanner>
                <StyledNewsletterBannerTitles>
                  <StyledNewsletterBannerTitle
                    {...getAdminPreviewFieldTargetProps(adminSelection?.newsletterBannerTitleFieldKey)}
                    style={getActiveAdminPreviewTargetStyle(
                      adminSelection?.newsletterBannerTitleFieldKey,
                      adminSelection?.activeFieldKey
                    )}
                  >
                    {newsletter.bannerTitle}
                  </StyledNewsletterBannerTitle>
                  <StyledNewsletterBannerSubtitle
                    {...getAdminPreviewFieldTargetProps(adminSelection?.newsletterBannerSubtitleFieldKey)}
                    style={getActiveAdminPreviewTargetStyle(
                      adminSelection?.newsletterBannerSubtitleFieldKey,
                      adminSelection?.activeFieldKey
                    )}
                  >
                    {newsletter.bannerSubtitle}
                  </StyledNewsletterBannerSubtitle>
                </StyledNewsletterBannerTitles>
                <StyledNewsletterSignupButtonWrapper>
                  <Button
                    {...getAdminPreviewFieldTargetProps(adminSelection?.newsletterSignupLinkFieldKey)}
                    variant="contained"
                    size="large"
                    startIcon={<Image src="./flocknote-logo.png" alt="flocknote signup" width={32} height={32} />}
                    href={newsletter.signupLink}
                    target="_blank"
                    sx={{
                      ...getActiveAdminPreviewTargetStyle(
                        adminSelection?.newsletterSignupLinkFieldKey,
                        adminSelection?.activeFieldKey
                      ),
                      fontSize: '26px',
                      backgroundColor: '#bc2f3b',
                      '&:hover': {
                        backgroundColor: '#d24c57',
                        color: '#ffffff'
                      },
                      '.MuiButton-startIcon > *:nth-of-type(1)': {
                        fontSize: '24px'
                      },
                      [getContainerQuery(theme.breakpoints.down(LARGE_BREAKPOINT))]: {
                        fontSize: '22px'
                      },
                      [getContainerQuery(theme.breakpoints.down(SMALL_BREAKPOINT))]: {
                        fontSize: '20px'
                      },
                      [getContainerQuery(theme.breakpoints.down(EXTRA_SMALL_BREAKPOINT))]: {
                        fontSize: '16px'
                      },
                      [getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT))]: {
                        fontSize: '14px',
                        '.MuiButton-startIcon > *:nth-of-type(1)': {
                          fontSize: '20px'
                        }
                      }
                    }}
                  >
                    <span
                      {...getAdminPreviewFieldTargetProps(adminSelection?.newsletterSignupButtonTextFieldKey)}
                      style={getActiveAdminPreviewTargetStyle(
                        adminSelection?.newsletterSignupButtonTextFieldKey,
                        adminSelection?.activeFieldKey
                      )}
                    >
                      {newsletter.signupButtonText}
                    </span>
                  </Button>
                </StyledNewsletterSignupButtonWrapper>
              </StyledNewsletterBanner>
            </StyledNewsletterSignupSectionContent>
          </Container>
        </StyledNewsletterSignupSectionWrapper>
        <StyledNewsAndEventsWrapper>
          <Container>
            <StyledWidgetsContent>
              <StyledWidgetSectionContent>
                <RecentNews posts={recentPosts} size="large" />
                <UpcomingEventsNoSSR />
              </StyledWidgetSectionContent>
            </StyledWidgetsContent>
          </Container>
        </StyledNewsAndEventsWrapper>
        <Footer churchDetails={churchDetails} privacyPolicyLink={privacyPolicyUrl} hideSearch={hideSearch} />
      </StyledHomepageView>
    );
  }
);

HomepageView.displayName = 'HomepageView';

export default HomepageView;
