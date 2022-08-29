/* eslint-disable react/display-name */
import Box from '@mui/material/Box';
import { memo } from 'react';
import { HomePageData, SerializedSlide, Times } from '../../interface';
import CarouselView from '../carousel/CarouselView';
import Footer from '../layout/footer/Footer';
import Schedule from '../schedule/Schedule';

interface HomepageViewProps {
  slides: SerializedSlide[];
  homePageData: HomePageData;
  times: Times[];
}

const HomepageView = memo(
  ({ slides, homePageData: { schedule_background, schedule_background_fallback_color }, times }: HomepageViewProps) => {
    console.log('[data]', slides, schedule_background, schedule_background_fallback_color);

    return (
      <Box sx={{ width: '100%' }}>
        <CarouselView slides={slides} />
        <Schedule times={times} background={schedule_background} backgroundColor={schedule_background_fallback_color} />
        <Footer />
      </Box>
    );
  }
);

export default HomepageView;
