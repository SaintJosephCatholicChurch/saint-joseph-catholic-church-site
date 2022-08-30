import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import StyleCopy from '../../cms/StyleCopy';

const BlogPostPreview = ({ entry, widgetFor, document }: PreviewTemplateComponentProps) => {
  return (
    <div>
      <StyleCopy document={document}>
        <h1>{entry.getIn(['data', 'title'])}</h1>
        <time>{entry.getIn(['data', 'date'])}</time>
        <div>{widgetFor('body')}</div>
      </StyleCopy>
    </div>
  );
};
export default BlogPostPreview;
