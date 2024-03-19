import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';

import { isNotEmpty } from '../../util/string.util';
import PageContentView from '../pages/PageContentView';
import PostTitle from '../pages/PageTitle';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';

import type { NewsPostData } from '../../interface';

const StyledReadMore = styled('div')`
  color: #bf303c;
`;

interface PostSummaryProps {
  post: NewsPostData;
}

const PostSummary = memo(({ post }: PostSummaryProps) => {
  const [html, setHtml] = useState<string>('');
  useEffect(() => {
    setHtml(post.summary);
  }, [post.summary]);

  return (
    <Link href={post.link} target={post.target}>
      <Button
        sx={{
          textDecoration: 'none',
          textTransform: 'none',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          margin: '-6px -8px',
          boxSizing: 'content-box',
          width: '100%',
          '&:hover': {
            backgroundColor: 'transparent',
            '.read-more': {
              color: '#822129',
              textDecoration: 'underline'
            }
          }
        }}
      >
        {isNotEmpty(post.image) ? <PostImage title={post.title} image={post.image} /> : null}
        <PostTitle title={post.title} enableMarginTop={isNotEmpty(post.image)} />
        <PostDateAuthorLine date={post.date} disableMargin />
        <Box>
          <PageContentView>
            <div
              dangerouslySetInnerHTML={{
                __html: html
              }}
            />
          </PageContentView>
        </Box>
        <StyledReadMore className="read-more">Read More</StyledReadMore>
      </Button>
    </Link>
  );
});

PostSummary.displayName = 'PostSummary';

export default PostSummary;
