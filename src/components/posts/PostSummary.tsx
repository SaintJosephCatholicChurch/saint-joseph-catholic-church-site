import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import parseISO from 'date-fns/parseISO';
import { MDXRemote } from 'next-mdx-remote';
import { memo, useMemo } from 'react';
import { SerializedPostContent } from '../../interface';
import PageContentView from '../pages/PageContentView';
import PostDateAuthorLine from './PostDateAuthorLine';
import PostImage from './PostImage';
import PostTitle from './PostTitle';

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
      <Link href={`/posts/${slug}`} underline="none">
        <PostImage title={title} image={image} />
        <PostTitle title={title} sx={{ mt: 3, mb: 2 }} />
        <PostDateAuthorLine date={date} />
        <Box>
          <PageContentView>
            <MDXRemote {...source} />
          </PageContentView>
        </Box>
        <Box>Read More</Box>
      </Link>
    );
  }
);

PostSummary.displayName = 'PostSummary';

export default PostSummary;
