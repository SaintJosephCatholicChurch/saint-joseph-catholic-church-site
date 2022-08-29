import Box from '@mui/material/Box';
import { MDXRemote } from 'next-mdx-remote';
import carouselStyles from '../../../public/styles/carousel-content.module.css';
import { CAROUSEL_MAX_HEIGHT, MAX_APP_WIDTH } from '../../constants';
import { SerializedSlide } from '../../interface';

interface CarouselSlideProps {
  slide: SerializedSlide;
}

const CarouselSlide = ({ slide: { image, titleSource } }: CarouselSlideProps) => {
  return (
    <Box className="each-fade" sx={{ position: 'relative' }}>
      <Box
        className="image-container"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: CAROUSEL_MAX_HEIGHT
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ maxWidth: MAX_APP_WIDTH, width: '100%' }} className={`${carouselStyles.carouselContent}`}>
          <MDXRemote {...titleSource} />
        </Box>
      </Box>
    </Box>
  );
};

export default CarouselSlide;
