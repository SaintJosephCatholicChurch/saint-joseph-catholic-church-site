import { memo } from 'react';
import { HomePageData, SerializedSlide, Times } from '../../interface';
import churchDetails from '../../lib/church_details';
import styled from '../../util/styled.util';
import CarouselView from '../carousel/CarouselView';
import Footer from '../layout/footer/Footer';
import Schedule from '../schedule/Schedule';

const StyledHomepageView = styled('div')`
  width: 100%;
`;

interface HomepageViewProps {
  slides: SerializedSlide[];
  homePageData: HomePageData;
  times: Times[];
}

const HomepageView = memo(
  ({ slides, homePageData: { schedule_background, schedule_background_fallback_color }, times }: HomepageViewProps) => {
    return (
      <StyledHomepageView>
        <CarouselView slides={slides} />
        <Schedule times={times} background={schedule_background} backgroundColor={schedule_background_fallback_color} />
        <Footer churchDetails={churchDetails} />
      </StyledHomepageView>
    );
  }
);

HomepageView.displayName = 'HomepageView';

export default HomepageView;
