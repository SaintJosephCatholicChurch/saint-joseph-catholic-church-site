import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import parseISO from 'date-fns/parseISO';
import Link from 'next/link';
import { memo, useEffect, useMemo, useState } from 'react';
import type { PostContent } from '../../interface';
import PageContentView from '../pages/PageContentView';
import PostTitle from '../pages/PageTitle';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';

const StyledReadMore = styled('div')`
  color: #bf303c;
`;

interface PostSummaryProps {
  post: PostContent;
}

const PostSummary = memo(
  ({
    post: {
      data: { title, date: dateString, image, slug },
      summary
    }
  }: PostSummaryProps) => {
    const [html, setHtml] = useState<string>('');
    useEffect(() => {
      setHtml(summary);
    }, [summary]);

    const date = useMemo(() => parseISO(dateString), [dateString]);
    return (
      <Link href={`/posts/${slug}`}>
        <Button
          sx={{
            textDecoration: 'none',
            textTransform: 'none',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
            '&:hover': {
              backgroundColor: 'rgba(100,100,100,0.12)',
              '.read-more': {
                color: '#333'
              }
            }
          }}
        >
          <PostImage title={title} image={image} />
          <PostTitle title={title} enableMarginTop />
          <PostDateAuthorLine date={date} />
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
  }
);

PostSummary.displayName = 'PostSummary';

export default PostSummary;
