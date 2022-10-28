import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import {
  CAROUSEL_DURATION,
  CAROUSEL_MAX_HEIGHT_LG,
  CAROUSEL_MAX_HEIGHT_MD,
  CAROUSEL_MAX_HEIGHT_SM
} from '../../constants';
import transientOptions from '../../util/transientOptions';

import type { Slide } from '../../interface';

const StyledCarouselSlide = styled('div')(
  ({ theme }) => `
    position: relative;
    
    width: 100%;
    height: ${CAROUSEL_MAX_HEIGHT_LG}px;
    ${theme.breakpoints.only('md')} {
      height: ${CAROUSEL_MAX_HEIGHT_MD}px;
    }
    ${theme.breakpoints.down('md')} {
      height: ${CAROUSEL_MAX_HEIGHT_SM}px;
    }
  `
);

interface StyledImageProps {
  $image: string;
}

const StyledImage = styled(
  'div',
  transientOptions
)<StyledImageProps>(
  ({ theme, $image }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(${$image});
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
  
    height: ${CAROUSEL_MAX_HEIGHT_LG}px;
    ${theme.breakpoints.only('md')} {
      height: ${CAROUSEL_MAX_HEIGHT_MD}px;
    }
    ${theme.breakpoints.down('md')} {
      height: ${CAROUSEL_MAX_HEIGHT_SM}px;
    }
  `
);

const StyledTitleWrapper = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface StyledTitleProps {
  $active: boolean;
}

const StyledTitle = styled(
  'h1',
  transientOptions
)<StyledTitleProps>(
  ({ theme, $active }) => `
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 2px;
    width: 100%;
    text-align: center;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-shadow: -1.5px 1.5px rgba(0,0,0,0.25);
    
    scale: 1;
    ${
      $active
        ? `
          transition: scale ${CAROUSEL_DURATION / 1000}s linear;
          scale: 1.1;
        `
        : ''
    }
  
    font-size: 64px;
    ${theme.breakpoints.only('md')} {
      font-size: 64px;
    }
    ${theme.breakpoints.down('md')} {
      font-size: 32px;
    }
  `
);

interface CarouselSlideProps {
  slide: Slide;
  active: boolean;
}

const CarouselSlide = ({ slide: { image, title }, active }: CarouselSlideProps) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  return (
    <StyledCarouselSlide className="each-fade">
      <StyledImage className="image-container" $image={image} />
      <StyledTitleWrapper>
        <StyledTitle $active={isActive}>
          {title}
        </StyledTitle>
      </StyledTitleWrapper>
    </StyledCarouselSlide>
  );
};

export default CarouselSlide;
