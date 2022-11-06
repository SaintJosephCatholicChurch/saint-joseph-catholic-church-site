import { styled } from '@mui/material/styles';

import PageContentView from '../pages/PageContentView';
import PageTitle from '../pages/PageTitle';

import type { TemplatePreviewProps } from '@staticcms/core';
import type { PageContentData } from '../../interface';

const StyledPagePreview = styled('div')`
  display: flex;
  justify-content: center;
`;

const StyledPagePreviewContent = styled('div')`
  margin-top: 32px;
  max-width: 800px;
  width: 100%;
`;

interface PagePreviewData extends PageContentData {
  body: string;
}

const PagePreview = ({ entry, widgetFor }: TemplatePreviewProps<PagePreviewData>) => {
  return (
    <StyledPagePreview>
      <StyledPagePreviewContent>
        <PageTitle title={entry.data?.title ?? ''} />
        <PageContentView>{widgetFor('body')}</PageContentView>
      </StyledPagePreviewContent>
    </StyledPagePreview>
  );
};
export default PagePreview;
