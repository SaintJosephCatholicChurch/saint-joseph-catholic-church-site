import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import parseISO from 'date-fns/parseISO';
import { MDXRemote } from 'next-mdx-remote';
import { memo, useMemo } from 'react';
import { SerializedPostContent } from '../../interface';
import styled from '../../util/styled.util';
import PageContentView from '../pages/PageContentView';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';
import PostTitle from './PostTitle';

const StyledPostTitle = styled('div')`
  h3 {
    margin-top: 24px;
    margin-bottom: 16px;
  }
`;

const StyledReadMore = styled('div')`
  color: #bf303c;
`;

interface PostSummaryProps {
  post: SerializedPostContent;
}

const PostSummary = memo(
  ({
    post: {
      data: { title, date: dateString, image, slug },
      source
    }
  }: PostSummaryProps) => {
    const date = useMemo(() => parseISO(dateString), [dateString]);
    return (
      <Link
        href={`/posts/${slug}`}
        underline="none"
        sx={{
          '&:hover .read-more': {
            color: '#333'
          }
        }}
      >
        <PostImage title={title} image={image} />
        <StyledPostTitle>
          <PostTitle title={title} />
        </StyledPostTitle>
        <PostDateAuthorLine date={date} />
        <Box>
          <PageContentView>
            <MDXRemote {...source} />
          </PageContentView>
        </Box>
        <StyledReadMore className="read-more">Read More</StyledReadMore>
      </Link>
    );
  }
);

PostSummary.displayName = 'PostSummary';

export default PostSummary;
