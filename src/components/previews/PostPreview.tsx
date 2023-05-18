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
