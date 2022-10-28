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
import type { Slide } from '../../interface';
import CarouselSlide from './CarouselSlide';

const StyledCarouselViewWrapper = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(273.55deg, #f1f1f1 3%, rgba(241, 241, 241, 0) 30%),#c7c7c7;
`;

const StyledCarouselView = styled('div')(
  ({ theme }) => `
    display: flex;
    overflow: hidden;
    position: relative;
    width: 100%;
	  max-width: 1600px;

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

      ${theme.breakpoints.down('md')} {
        display: none;
      }
    }

    height: ${CAROUSEL_MAX_HEIGHT_LG}px;
    ${theme.breakpoints.only('md')} {
      height: ${CAROUSEL_MAX_HEIGHT_MD}px;
    }
    ${theme.breakpoints.down('md')} {
      height: ${CAROUSEL_MAX_HEIGHT_SM}px;
    }
  `
);

interface CarouselViewProps {
  slides: Slide[];
}

const CarouselView = ({ slides }: CarouselViewProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = useCallback((_old: number, next: number) => {
    setActiveSlide(next);
  }, []);

  return (
    <StyledCarouselViewWrapper>
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
