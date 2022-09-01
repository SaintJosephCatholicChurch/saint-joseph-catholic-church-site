import { MDXRemote } from 'next-mdx-remote';
import carouselStyles from '../../../public/styles/carousel-content.module.css';
import { CAROUSEL_MAX_HEIGHT, MAX_APP_WIDTH } from '../../constants';
import { SerializedSlide } from '../../interface';
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

const StyledTitle = styled('div')`
  max-width: ${MAX_APP_WIDTH}px;
  width: 100%;
`;

interface CarouselSlideProps {
  slide: SerializedSlide;
}

const CarouselSlide = ({ slide: { image, titleSource } }: CarouselSlideProps) => {
  return (
    <StyledCarouselSlide className="each-fade">
      <StyledImage className="image-container" image={image} />
      <StyledTitleWrapper>
        <StyledTitle className={`${carouselStyles.carouselContent}`}>
          <MDXRemote {...titleSource} />
        </StyledTitle>
      </StyledTitleWrapper>
    </StyledCarouselSlide>
  );
};

export default CarouselSlide;
