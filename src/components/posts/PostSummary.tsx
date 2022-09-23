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
            margin: '-6px -8px',
            '&:hover': {
              backgroundColor: 'transparent',
              '.read-more': {
                color: '#822129',
                textDecoration: 'underline'
              }
            }
          }}
        >
          <PostImage title={title} image={image} />
          <PostTitle title={title} enableMarginTop />
          <PostDateAuthorLine date={date} disableMargin />
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
