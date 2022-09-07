import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { CAROUSEL_MAX_HEIGHT_LG, CAROUSEL_MAX_HEIGHT_MD, CAROUSEL_MAX_HEIGHT_SM } from '../../constants';
import type { Slide } from '../../interface';
import styled from '../../util/styled.util';
import CarouselSlide from './CarouselSlide';

const StyledCarouselView = styled('div')(
  ({ theme }) => `
    display: flex;
    overflow: hidden;
    position: relative;
    width: 100%;

    & > div {
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
  return (
    <StyledCarouselView className="slide-container">
      <Fade>
        {slides.map((slide, index) => (
          <CarouselSlide key={`slide-${index}`} slide={slide} />
        ))}
      </Fade>
    </StyledCarouselView>
  );
};
export default CarouselView;
