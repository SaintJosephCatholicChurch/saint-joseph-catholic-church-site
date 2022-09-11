import dynamic from 'next/dynamic';
import { memo } from 'react';
import type { HomePageData, PostContent, Times } from '../../interface';
import churchDetails from '../../lib/church_details';
import styled from '../../util/styled.util';
import CarouselView from '../carousel/CarouselView';
import Container from '../layout/Container';
import Footer from '../layout/footer/Footer';
import ScheduleWidget from '../schedule/ScheduleWidget';
import DailyReadings from '../widgets/DailyReadings';
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

const StyledWidgetSectionContent = styled('div')(
  ({ theme }) => `
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 64px;
    width: 100%;

    ${theme.breakpoints.down('lg')} {
      gap: 40px;
    }

    ${theme.breakpoints.down('md')} {
      grid-template-columns: minmax(0, 1fr);
      gap: 32px;
    }
  `
);

const StyledDailyReadingsSectionContent = styled('div')`
  display: flex;
  gap: 64px;
  width: 100%;
`;

const StyledDailyReadingsSectionBackground = styled('div')`
  opacity: 0.6;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url(/files/scripture-background.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0.25;
  pointer-events: none;
`;

const StyledDailyReadings = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 16px 0;

    ${theme.breakpoints.down('lg')} {
      gap: 0;
    }

    ${theme.breakpoints.down('md')} {
      margin: 8px 0;
    }
  `
);

const StyledDailyReadingsSubtitle = styled('h4')`
  color: #666;
  font-size: 14px;
  text-transform: uppercase;
  margin-top: 0;
`;

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
        <StyledSectionWrapper>
          <StyledDailyReadingsSectionBackground />
          <Container>
            <StyledDailyReadingsSectionContent>
              <StyledDailyReadings>
                <StyledDailyReadingsSubtitle>
                  FROM THE UNITED STATES CONFERENCE OF CATHOLIC BISHOPS (USCCB)
                </StyledDailyReadingsSubtitle>
                <DailyReadings isFullWidth />
              </StyledDailyReadings>
            </StyledDailyReadingsSectionContent>
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
