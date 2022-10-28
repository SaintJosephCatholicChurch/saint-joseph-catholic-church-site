import { styled } from '@mui/material/styles';
import parseISO from 'date-fns/parseISO';
import { useMemo } from 'react';

import PostView from '../posts/PostView';

import type { PreviewTemplateComponentProps } from '@staticcms/core';

const StyledBlogPostPreview = styled('div')`
  display: flex;
  justify-content: center;
`;

const StyledBlogPostPreviewContent = styled('div')`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const BlogPostPreview = ({ entry, widgetFor, getAsset }: PreviewTemplateComponentProps) => {
  const dateString = useMemo(() => entry.getIn(['data', 'date']) as string, [entry]);

  const date = useMemo(() => parseISO(dateString), [dateString]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const image = useMemo(() => getAsset(entry.getIn(['data', 'image'])) as { url: string }, [entry, getAsset]);

  return (
    <StyledBlogPostPreview>
      <StyledBlogPostPreviewContent>
        <PostView
          title={entry.getIn(['data', 'title']) as string}
          tags={(entry.getIn(['data', 'tags']) as string[]) ?? []}
          date={date}
          image={image.url}
        >
          {widgetFor('body')}
        </PostView>
      </StyledBlogPostPreviewContent>
    </StyledBlogPostPreview>
  );
};
export default BlogPostPreview;
