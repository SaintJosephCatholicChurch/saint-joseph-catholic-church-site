import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import StyleCopy from '../../cms/StyleCopy';
import styled from '../../util/styled.util';
import PageContentView from '../pages/PageContentView';
import PageTitle from '../pages/PageTitle';

const StyledPagePreview = styled('div')`
  display: flex;
  justify-content: center;
`;

const StyledPagePreviewContent = styled('div')`
  margin-top: 32px;
  max-width: 800px;
  width: 100%;
`;

const PagePreview = ({ entry, widgetFor, document }: PreviewTemplateComponentProps) => {
  return (
    <StyleCopy document={document}>
      <StyledPagePreview>
        <StyledPagePreviewContent>
          <PageTitle title={entry.getIn(['data', 'title'])} />
          <PageContentView>{widgetFor('body')}</PageContentView>
        </StyledPagePreviewContent>
      </StyledPagePreview>
    </StyleCopy>
  );
};
export default PagePreview;
