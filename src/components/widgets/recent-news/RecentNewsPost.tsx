import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';

import { isNotEmpty } from '../../../util/string.util';
import transientOptions from '../../../util/transientOptions';

import type { PostContent } from '../../../interface';

interface StyledPostImageProps {
  $image: string;
  $size: 'small' | 'large';
}

const StyledPostImage = styled(
  'div',
  transientOptions
)<StyledPostImageProps>(
  ({ theme, $image, $size }) => `
    background-image: url(${$image});
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: ${$size === 'large' ? '90' : '72'}px;

    ${theme.breakpoints.down('sm')} {
      height: 72px;
    }
    
    ${theme.breakpoints.only('md')} {
      height: 72px;
    }

    overflow: hidden;
  `
);

const StyledPostDetails = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  overflow: hidden;
`;

interface StyledPostTitleProps {
  $size: 'small' | 'large';
}

const StyledPostTitle = styled(
  'h4',
  transientOptions
)<StyledPostTitleProps>(
  ({ theme, $size }) => `
    margin: 0;
    font-size: ${$size === 'large' ? '18' : '16'}px;

    ${theme.breakpoints.down('sm')} {
      font-size: 16px;
    }
    
    ${theme.breakpoints.only('md')} {
      font-size: 16px;
    }

    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
  `
);

interface StyledPostSummaryProps {
  $size: 'small' | 'large';
}

const StyledPostSummary = styled(
  'div',
  transientOptions
)<StyledPostSummaryProps>(
  ({ theme, $size }) => `
    margin: 0;
    overflow: hidden;
    height: 52px;
    font-size: ${$size === 'large' ? '16' : '15'}px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;,

    & > p {
      margin: 0;
    }

    ${theme.breakpoints.down('sm')} {
      font-size: 15px;
    }

    ${theme.breakpoints.only('md')} {
      font-size: 15px;
    }
  `
);

interface RecentNewsProps {
  post: PostContent;
  size?: 'small' | 'large';
}

const RecentNewsPost = memo(
  ({
    post: {
      summary,
      data: { slug, image, title }
    },
    size = 'small'
  }: RecentNewsProps) => {
    const theme = useTheme();

    const [html, setHtml] = useState<string>('');
    useEffect(() => {
      setHtml(summary);
    }, [summary]);

    return (
      <Link href={`/news/${slug}`}>
        <Button
          sx={{
            display: isNotEmpty(image) ? 'grid' : 'flex',
            gridTemplateColumns: `${size === 'large' ? '160' : '110'}px auto`,
            [theme.breakpoints.down('sm')]: {
              gridTemplateColumns: '110px auto'
            },
            [theme.breakpoints.only('md')]: {
              gridTemplateColumns: '110px auto'
            },
            gap: '8px',
            width: '100%',
            color: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            textTransform: 'unset',
            textAlign: 'left',
            padding: '6px 8px',
            margin: '-6px -8px',
            '&:hover': {
              backgroundColor: 'rgba(100,100,100,0.12)'
            }
          }}
        >
          {isNotEmpty(image) ? <StyledPostImage $image={image} $size={size} /> : null}
          <StyledPostDetails>
            <StyledPostTitle $size={size}>{title}</StyledPostTitle>
            <StyledPostSummary
              $size={size}
              dangerouslySetInnerHTML={{
                __html: html
              }}
            />
          </StyledPostDetails>
        </Button>
      </Link>
    );
  }
);

RecentNewsPost.displayName = 'RecentNewsPost';

export default RecentNewsPost;
