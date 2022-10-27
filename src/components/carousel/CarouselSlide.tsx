import { styled } from '@mui/material/styles';
import carouselStyles from '../../../public/styles/carousel-content.module.css';
import {
  CAROUSEL_DURATION,
  CAROUSEL_MAX_HEIGHT_LG,
  CAROUSEL_MAX_HEIGHT_MD,
  CAROUSEL_MAX_HEIGHT_SM
} from '../../constants';
import type { Slide } from '../../interface';
import transientOptions from '../../util/transientOptions';

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
    
    ${$active ? `transition: font-size ${CAROUSEL_DURATION / 1000}s;` : ''}
    font-size: ${$active ? '72px' : '64px'};
    ${theme.breakpoints.only('md')} {
      font-size: ${$active ? '72px' : '64px'};
    }
    ${theme.breakpoints.down('md')} {
      font-size: ${$active ? '40px' : '32px'};
    }
  `
);

interface CarouselSlideProps {
  slide: Slide;
  active: boolean;
}

const CarouselSlide = ({ slide: { image, title }, active }: CarouselSlideProps) => {
  return (
    <StyledCarouselSlide className="each-fade">
      <StyledImage className="image-container" $image={image} />
      <StyledTitleWrapper>
        <StyledTitle className={`${carouselStyles.carouselContent}`} $active={active}>
          {title}
        </StyledTitle>
      </StyledTitleWrapper>
    </StyledCarouselSlide>
  );
};

export default CarouselSlide;
