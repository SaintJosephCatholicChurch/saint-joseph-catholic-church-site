import { styled } from '@mui/material/styles';

import PageContentView from '../pages/PageContentView';
import PageTitle from '../pages/PageTitle';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { PageContentData } from '@/interface';

const StyledPagePreview = styled('div')`
  display: flex;
  justify-content: center;
  container: page / inline-size;
  font-family:
    Open Sans,
    Roboto,
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Oxygen-Sans,
    Ubuntu,
    Cantarell,
    Helvetica Neue,
    sans-serif;
  background-color: #f5f4f3;
  color: #222;
  font-weight: 200;
  font-size: 16px;
`;

const StyledPagePreviewContent = styled('div')`
  margin-top: 32px;
  max-width: 800px;
  width: 100%;
`;

const PagePreview: TemplatePreviewComponent<PageContentData & { body: string }> = ({ entry, widgetFor }) => {
  return (
    <StyledPagePreview>
      <StyledPagePreviewContent>
        <PageTitle title={entry.data.title} />
        <PageContentView>{widgetFor('body')}</PageContentView>
      </StyledPagePreviewContent>
    </StyledPagePreview>
  );
};
export default PagePreview;
