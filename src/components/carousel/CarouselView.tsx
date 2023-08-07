import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { Fade } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
import {
  CAROUSEL_DURATION,
  CAROUSEL_MAX_HEIGHT_LG,
  CAROUSEL_MAX_HEIGHT_MD,
  CAROUSEL_MAX_HEIGHT_SM
} from '../../constants';
import transientOptions from '../../util/transientOptions';
import CarouselSlide from './CarouselSlide';

import type { ScheduleSection, Slide } from '../../interface';

interface StyledScheduleProps {
  $background: string;
}

const StyledCarouselViewWrapper = styled(
  'div',
  transientOptions
)<StyledScheduleProps>(
  ({ $background }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(#f1f1f1 10%, rgba(241, 241, 241, 0.5) 50%), url(${$background}), #c7c7c7;
  `
);

const StyledCarouselView = styled('div')(
  ({ theme }) => `
    display: flex;
    overflow: hidden;
    position: relative;

    & > div,
    & .react-slideshow-fadezoom-images-wrap,
    & .react-slideshow-fadezoom-images-wrap > div {
      width: 100%;
    }

    & .nav.default-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      padding: 0;

      &:first-of-type {
        margin-left: 32px;
      }

      &:last-of-type {
        margin-right: 32px;
      }

      & > svg {
        display: flex;
        opacity: 0.75;
        width: 16px;
        height: 16px;
      }

      ${theme.breakpoints.down('md').replace("@media", "@container page")} {
        display: none;
      }
    }

    width: 100%;
    max-width: calc(65vh * 2.25);

    height: 65vh;
    ${theme.breakpoints.between('md', 'lg').replace("@media", "@container page")} {
      height: ${CAROUSEL_MAX_HEIGHT_LG}px;
    }
    ${theme.breakpoints.between('sm', 'md').replace("@media", "@container page")} {
      height: ${CAROUSEL_MAX_HEIGHT_MD}px;
    }
    ${theme.breakpoints.down('sm').replace("@media", "@container page")} {
      height: ${CAROUSEL_MAX_HEIGHT_SM}px;
    }
  `
);

interface CarouselViewProps {
  slides: Slide[];
  details?: ScheduleSection;
}

const CarouselView = ({ slides, details }: CarouselViewProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = useCallback((_old: number, next: number) => {
    setActiveSlide(next);
  }, []);

  return (
    <StyledCarouselViewWrapper $background={details?.schedule_background}>
      <StyledCarouselView className="slide-container">
        <Fade duration={CAROUSEL_DURATION} onChange={handleSlideChange}>
          {slides.map((slide, index) => (
            <CarouselSlide key={`slide-${index}`} slide={slide} active={activeSlide === index} />
          ))}
        </Fade>
      </StyledCarouselView>
    </StyledCarouselViewWrapper>
  );
};
export default CarouselView;
