import { styled } from '@mui/material/styles';
import parseISO from 'date-fns/parseISO';
import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import PostView from '../posts/PostView';

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
  const dateString = useMemo(() => entry.getIn(['data', 'date']), [entry]);
  const date = useMemo(() => parseISO(dateString), [dateString]);
  const image = useMemo(() => getAsset(entry.getIn(['data', 'image'])), [entry, getAsset]);

  return (
    <StyledBlogPostPreview>
      <StyledBlogPostPreviewContent>
        <PostView
          title={entry.getIn(['data', 'title'])}
          tags={entry.getIn(['data', 'tags']) ?? []}
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
