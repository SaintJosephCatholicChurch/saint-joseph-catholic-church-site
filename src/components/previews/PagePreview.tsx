import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import StyleCopy from '../../cms/StyleCopy';
import PageView from '../pages/PageView';
import PageContent from '../pages/PageContent';

const PagePreview = ({ entry, widgetFor, document }: PreviewTemplateComponentProps) => {
  return (
    <>
      <StyleCopy document={document}>
        <PageView title={entry.getIn(['data', 'title'])} showHeader>
          <PageContent>{widgetFor('body')}</PageContent>
        </PageView>
      </StyleCopy>
    </>
  );
};
export default PagePreview;
