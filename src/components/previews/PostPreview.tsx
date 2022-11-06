import { styled } from '@mui/material/styles';
import parseISO from 'date-fns/parseISO';
import { useEffect, useMemo, useState } from 'react';

import PostView from '../posts/PostView';

import type { TemplatePreviewProps } from '@staticcms/core';
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

interface PagePreviewData extends PostContentData {
  body: string;
}

const BlogPostPreview = ({ entry, widgetFor, getAsset }: TemplatePreviewProps<PagePreviewData>) => {
  const dateString = useMemo(() => entry.data.date, [entry.data.date]);

  const date = useMemo(() => parseISO(dateString), [dateString]);

  const [image, setImage] = useState('');
  useEffect(() => {
    let alive = true;

    const loadImage = async () => {
      const loadedImage = await getAsset(entry.data.image);
      if (alive) {
        setImage(loadedImage.toString());
      }
    };

    loadImage();

    return () => {
      alive = false;
    };
  }, [entry.data.image, getAsset]);

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
