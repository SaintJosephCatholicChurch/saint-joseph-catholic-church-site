import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import StyleCopy from '../../cms/StyleCopy';
import PageView from '../pages/PageView';
import PageContentView from '../pages/PageContentView';
import styled from '../../util/styled.util';

const StyledPagePreview = styled('div')`
  display: flex;
  justify-content: center;
`;

const StyledPagePreviewContent = styled('div')`
  margin-top: 32px;
  max-width: 800px;
`;

const PagePreview = ({ entry, widgetFor, document }: PreviewTemplateComponentProps) => {
  return (
    <StyleCopy document={document}>
      <StyledPagePreview>
        <StyledPagePreviewContent>
          <PageContentView>{widgetFor('body')}</PageContentView>
        </StyledPagePreviewContent>
      </StyledPagePreview>
    </StyleCopy>
  );
};
export default PagePreview;
