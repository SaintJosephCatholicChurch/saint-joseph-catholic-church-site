import { styled } from '@mui/material/styles';
import { PreviewTemplateComponentProps } from 'netlify-cms-core';
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

const PagePreview = ({ entry, widgetFor }: PreviewTemplateComponentProps) => {
  return (
    <StyledPagePreview>
      <StyledPagePreviewContent>
        <PageTitle title={entry.getIn(['data', 'title'])} />
        <PageContentView>{widgetFor('body')}</PageContentView>
      </StyledPagePreviewContent>
    </StyledPagePreview>
  );
};
export default PagePreview;
