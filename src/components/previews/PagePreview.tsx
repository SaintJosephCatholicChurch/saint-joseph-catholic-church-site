import { styled } from '@mui/material/styles';

import PageContentView from '../pages/PageContentView';
import PageTitle from '../pages/PageTitle';

import type { PreviewTemplateComponentProps } from '@staticcms/core';

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
        <PageTitle title={entry.getIn(['data', 'title']) as string} />
        <PageContentView>{widgetFor('body')}</PageContentView>
      </StyledPagePreviewContent>
    </StyledPagePreview>
  );
};
export default PagePreview;
