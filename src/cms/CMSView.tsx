import cmsApp from 'netlify-cms-app';
import { CmsConfig } from 'netlify-cms-core';
import { useEffect } from 'react';
import BlogPostPreview from '../components/previews/BlogPostPreview';
import HomePagePreview from '../components/previews/HomePagePreview';
import PagePreview from '../components/previews/PagePreview';
import SchedulePreview from '../components/previews/SchedulePreview';
import { useScript } from '../util/useScript';
import config from './config';
import controlComponent from './markdown/MarkdownControl';
import previewComponent from './markdown/MarkdownPreview';
import schema from './markdown/schema';
import TimesWidget from './widgets/times/TimesWidget';

const CMSView = () => {
  useScript('https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js');

  useEffect(() => {
    if (!cmsApp) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      config.local_backend = true;
    }

    cmsApp.init({ config } as { config: CmsConfig });

    cmsApp.registerWidget('times', TimesWidget);
    (cmsApp.registerWidget as any)('markdown', controlComponent, previewComponent, schema);

    cmsApp.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap');
    cmsApp.registerPreviewStyle('/styles/content.module.css');
    cmsApp.registerPreviewTemplate('posts', BlogPostPreview);
    cmsApp.registerPreviewTemplate('pages', PagePreview);
    cmsApp.registerPreviewTemplate('homepage', HomePagePreview);
    cmsApp.registerPreviewTemplate('times', SchedulePreview);
  }, []);

  return <div />;
};

export default CMSView;
