import cmsApp from 'netlify-cms-app';
import { useEffect } from 'react';
import BlogPostPreview from '../components/previews/BlogPostPreview';
import HomePagePreview from '../components/previews/HomePagePreview';
import PagePreview from '../components/previews/PagePreview';
import { useScript } from '../util/useScript';
import config from './config';
import controlComponent from './markdown/MarkdownControl';
import previewComponent from './markdown/MarkdownPreview';
import schema from './markdown/schema';

const CMSView = () => {
  useScript('https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js');

  useEffect(() => {
    if (!cmsApp) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      config.local_backend = true;
    }

    cmsApp.init({ config });
    cmsApp.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap');
    cmsApp.registerPreviewStyle('/styles/content.module.css');
    cmsApp.registerPreviewTemplate('posts', BlogPostPreview);
    cmsApp.registerPreviewTemplate('pages', PagePreview);
    cmsApp.registerPreviewTemplate('homepage', HomePagePreview);

    (cmsApp.registerWidget as any)('markdown', controlComponent, previewComponent, schema);
  }, []);

  return <div />;
};

export default CMSView;
