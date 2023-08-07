import { styled } from '@mui/material/styles';
import { useMediaAsset } from '@staticcms/core';
import parseISO from 'date-fns/parseISO';
import { useMemo } from 'react';

import PostView from '../posts/PostView';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { PostContentData } from '../../interface';

const StyledBlogPostPreview = styled('div')`
  display: flex;
  justify-content: center;
  container: page / inline-size;
  font-family: Open Sans,Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  background-color: #f5f4f3;
  color: #222;
  font-weight: 200;
  font-size: 16px;
`;

const StyledBlogPostPreviewContent = styled('div')`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const BlogPostPreview: TemplatePreviewComponent<PostContentData & { body: string }> = ({
  entry,
  widgetFor,
  collection
}) => {
  const dateString = useMemo(() => entry.data.date, [entry.data.date]);

  const date = useMemo(() => parseISO(dateString), [dateString]);

  const imageField = useMemo(
    () => ('fields' in collection ? collection.fields.find((f) => f.name === 'image') : null),
    [collection]
  );
  const image = useMediaAsset(entry.data.image, collection, imageField, entry);

  return (
    <StyledBlogPostPreview>
      <StyledBlogPostPreviewContent>
        <PostView title={entry.data.title} tags={entry.data.tags ?? []} date={date} image={image}>
          {widgetFor('body')}
        </PostView>
      </StyledBlogPostPreviewContent>
    </StyledBlogPostPreview>
  );
};
export default BlogPostPreview;
