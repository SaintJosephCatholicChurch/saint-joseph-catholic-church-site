import { styled } from '@mui/material/styles';
import carouselStyles from '../../../public/styles/carousel-content.module.css';
import { CAROUSEL_MAX_HEIGHT_LG, CAROUSEL_MAX_HEIGHT_MD, CAROUSEL_MAX_HEIGHT_SM } from '../../constants';
import type { Slide } from '../../interface';
import transientOptions from '../../util/transientOptions';

const StyledCarouselSlide = styled('div')`
  position: relative;
`;

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

const StyledTitle = styled('h1')(
  ({ theme }) => `
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 2px;
    
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
}

const CarouselSlide = ({ slide: { image, title } }: CarouselSlideProps) => {
  return (
    <StyledCarouselSlide className="each-fade">
      <StyledImage className="image-container" $image={image} />
      <StyledTitleWrapper>
        <StyledTitle className={`${carouselStyles.carouselContent}`}>{title}</StyledTitle>
      </StyledTitleWrapper>
    </StyledCarouselSlide>
  );
};

export default CarouselSlide;
