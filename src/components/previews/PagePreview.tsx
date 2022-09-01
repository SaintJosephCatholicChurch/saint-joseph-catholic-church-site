import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import StyleCopy from '../../cms/StyleCopy';
import PageView from '../pages/PageView';
import PageContentView from '../pages/PageContentView';

const PagePreview = ({ entry, widgetFor, document }: PreviewTemplateComponentProps) => {
  return (
    <StyleCopy document={document}>
      <PageView title={entry.getIn(['data', 'title'])} showHeader>
        <PageContentView>{widgetFor('body')}</PageContentView>
      </PageView>
    </StyleCopy>
  );
};
export default PagePreview;
