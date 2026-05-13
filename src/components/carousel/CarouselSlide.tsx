import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import {
  CAROUSEL_DURATION,
  CAROUSEL_MAX_HEIGHT_LG,
  CAROUSEL_MAX_HEIGHT_MD,
  CAROUSEL_MAX_HEIGHT_SM
} from '../../constants';
import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';
import {
  createHomepageSlideFieldKey,
  getActiveHomepagePreviewTargetStyle,
  type HomepageFieldKey
} from '../../admin/content-sections/homepage/fieldKeys';

import type { Slide } from '../../interface';
const StyledCarouselSlide = styled('div')(
  ({ theme }) => `
    position: relative;

    width: 100%;

    height: 65vh;
    ${getContainerQuery(theme.breakpoints.between('md', 'lg'))} {
      height: ${CAROUSEL_MAX_HEIGHT_LG}px;
    }
    ${getContainerQuery(theme.breakpoints.between('sm', 'md'))} {
      height: ${CAROUSEL_MAX_HEIGHT_MD}px;
    }
    ${getContainerQuery(theme.breakpoints.down('sm'))} {
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

    height: 65vh;
    ${getContainerQuery(theme.breakpoints.between('md', 'lg'))} {
      height: ${CAROUSEL_MAX_HEIGHT_LG}px;
    }
    ${getContainerQuery(theme.breakpoints.between('sm', 'md'))} {
      height: ${CAROUSEL_MAX_HEIGHT_MD}px;
    }
    ${getContainerQuery(theme.breakpoints.down('sm'))} {
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
  pointer-events: none;
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
    pointer-events: auto;
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
    ${getContainerQuery(theme.breakpoints.only('md'))} {
      font-size: 64px;
    }
    ${getContainerQuery(theme.breakpoints.down('md'))} {
      font-size: 32px;
    }
  `
);

interface CarouselSlideProps {
  activeFieldKey?: HomepageFieldKey;
  slide: Slide;
  slideIndex: number;
  active: boolean;
}

const CarouselSlide = ({ activeFieldKey, slide: { image, title }, slideIndex, active }: CarouselSlideProps) => {
  const [isActive, setIsActive] = useState(false);
  const imageFieldKey = createHomepageSlideFieldKey(slideIndex, 'image');
  const titleFieldKey = createHomepageSlideFieldKey(slideIndex, 'title');

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  return (
    <StyledCarouselSlide className="each-fade">
      <StyledImage
        className="image-container"
        $image={image}
        {...({ ['data-admin-field-key']: imageFieldKey } as Record<string, string>)}
        style={getActiveHomepagePreviewTargetStyle(imageFieldKey, activeFieldKey)}
      />
      <StyledTitleWrapper>
        <StyledTitle
          $active={isActive}
          {...({ ['data-admin-field-key']: titleFieldKey } as Record<string, string>)}
          style={getActiveHomepagePreviewTargetStyle(titleFieldKey, activeFieldKey)}
        >
          {title}
        </StyledTitle>
      </StyledTitleWrapper>
    </StyledCarouselSlide>
  );
};

export default CarouselSlide;
