import carouselStyles from '../../../public/styles/carousel-content.module.css';
import { CAROUSEL_MAX_HEIGHT, MAX_APP_WIDTH } from '../../constants';
import { Slide } from '../../interface';
import styled from '../../util/styled.util';

const StyledCarouselSlide = styled('div')`
  position: relative;
`;

interface StyledImageProps {
  image: string;
}

const StyledImage = styled('div', ['image'])<StyledImageProps>(
  ({ image }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(${image});
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: ${CAROUSEL_MAX_HEIGHT}px;
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

const StyledTitle = styled('h1')`
  color: #fff;
  font-size: 64px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 2px;
`;

interface CarouselSlideProps {
  slide: Slide;
}

const CarouselSlide = ({ slide: { image, title } }: CarouselSlideProps) => {
  return (
    <StyledCarouselSlide className="each-fade">
      <StyledImage className="image-container" image={image} />
      <StyledTitleWrapper>
        <StyledTitle className={`${carouselStyles.carouselContent}`}>{title}</StyledTitle>
      </StyledTitleWrapper>
    </StyledCarouselSlide>
  );
};

export default CarouselSlide;
