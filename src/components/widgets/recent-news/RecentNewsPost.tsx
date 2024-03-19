import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';

import getContainerQuery from '../../../util/container.util';
import { isNotEmpty } from '../../../util/string.util';
import transientOptions from '../../../util/transientOptions';

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
    width: ${$size === 'large' ? '160' : '110'}px;
    height: ${$size === 'large' ? '90' : '72'}px;
    flex-shrink: 0;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      height: 72px;
      width: 110px;
    }

    ${getContainerQuery(theme.breakpoints.only('md'))} {
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
  color: #4f4f4f;
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

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      font-size: 16px;
    }

    ${getContainerQuery(theme.breakpoints.only('md'))} {
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
    -webkit-box-orient: vertical;
    line-height: 18.4px;
    padding-bottom: 1px;

    & > p {
      margin: 0;
    }

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      font-size: 15px;
      line-height: 17.25px;
    }

    ${getContainerQuery(theme.breakpoints.only('md'))} {
      font-size: 15px;
      line-height: 17.25px;
    }
  `
);

export interface RecentNewsPostData {
  title: string;
  summary: string;
  link: string;
  image: string;
  date: Date;
  target?: '_blank';
}

export interface RecentNewsProps {
  post: RecentNewsPostData;
  size?: 'small' | 'large';
}

const RecentNewsPost = memo(({ post: { title, summary, link, image, target }, size = 'small' }: RecentNewsProps) => {
  const theme = useTheme();

  const [html, setHtml] = useState<string>('');
  useEffect(() => {
    setHtml(summary);
  }, [summary]);

  return (
    <Link href={link} target={target}>
      <Button
        sx={{
          display: 'flex',
          [getContainerQuery(theme.breakpoints.down('sm'))]: {
            gridTemplateColumns: '110px auto'
          },
          [getContainerQuery(theme.breakpoints.only('md'))]: {
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
});

RecentNewsPost.displayName = 'RecentNewsPost';

export default RecentNewsPost;
