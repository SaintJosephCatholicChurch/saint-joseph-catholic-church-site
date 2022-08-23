import { PreviewTemplateComponentProps } from 'netlify-cms-core';

const BlogPostPreview = ({ entry, widgetFor }: PreviewTemplateComponentProps) => {
  return (
    <div className="content">
      <h1>{entry.getIn(["data", "title"])}</h1>
      <time>{entry.getIn(["data", "date"])}</time>
      <div>{widgetFor('body')}</div>
    </div>
  );
}
export default BlogPostPreview