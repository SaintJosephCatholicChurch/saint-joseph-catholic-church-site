import Box from '@mui/material/Box';
import { useState } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { CAROUSEL_MAX_HEIGHT } from '../../constants';
import { SerializedSlide } from '../../interface';
import CarouselSlide from './CarouselSlide';

interface CarouselViewProps {
  slides: SerializedSlide[];
}

const CarouselView = ({ slides }: CarouselViewProps) => {
  return (
    <Box
      className="slide-container"
      sx={{
        height: CAROUSEL_MAX_HEIGHT,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        '& > div': {
          width: '100%'
        },
        '& .nav.default-nav': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.5,
          p: 0,
          '&:first-child': {
            ml: 4
          },
          '&:last-child': {
            mr: 4
          },
          '& > svg': {
            display: 'flex',
            opacity: 0.75,
            width: '16px',
            height: '16px'
          }
        }
      }}
    >
      <Fade>
        {slides.map((slide, index) => (
          <CarouselSlide key={`slide-${index}`} slide={slide} />
        ))}
      </Fade>
    </Box>
  );
};
export default CarouselView;
