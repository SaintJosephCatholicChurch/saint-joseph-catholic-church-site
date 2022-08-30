import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import StyleCopy from '../../cms/StyleCopy';
import PageView from '../pages/PageView';

const PagePreview = ({ entry, widgetFor, document }: PreviewTemplateComponentProps) => {
  return (
    <>
      <StyleCopy document={document}>
        <PageView title={entry.getIn(['data', 'title'])}>{widgetFor('body')}</PageView>
      </StyleCopy>
    </>
  );
};
export default PagePreview;
