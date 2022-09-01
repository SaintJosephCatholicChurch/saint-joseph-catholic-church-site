import parseISO from 'date-fns/parseISO';
import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import StyleCopy from '../../cms/StyleCopy';
import styled from '../../util/styled.util';
import PostView from '../posts/PostView';

const StyledBlogPostPreview = styled('div')`
  display: flex;
  justify-content: center;
`;

const StyledBlogPostPreviewContent = styled('div')`
  max-width: 800px;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const BlogPostPreview = ({ entry, widgetFor, document }: PreviewTemplateComponentProps) => {
  const dateString = useMemo(() => entry.getIn(['data', 'date']), [entry]);
  const date = useMemo(() => parseISO(dateString), [dateString]);

  return (
    <StyleCopy document={document}>
      <StyledBlogPostPreview>
        <StyledBlogPostPreviewContent>
          <PostView title={entry.getIn(['data', 'title'])} date={date} image={entry.getIn(['data', 'image'])}>
            {widgetFor('body')}
          </PostView>
        </StyledBlogPostPreviewContent>
      </StyledBlogPostPreview>
    </StyleCopy>
  );
};
export default BlogPostPreview;
