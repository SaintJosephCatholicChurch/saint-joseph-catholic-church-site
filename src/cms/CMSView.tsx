import cmsApp from 'netlify-cms-app';
import { CmsConfig } from 'netlify-cms-core';
import { useEffect } from 'react';
import BulletinsPreview from '../components/previews/BulletinsPreview';
import ChurchDetailsPreview from '../components/previews/ChurchDetailsPreview';
import HomePagePreview from '../components/previews/HomePagePreview';
import PagePreview from '../components/previews/PagePreview';
import PostPreview from '../components/previews/PostPreview';
import SchedulePreview from '../components/previews/SchedulePreview';
import { useScript } from '../util/useScript';
import config from './config';
import controlComponent from './markdown/MarkdownControl';
import previewComponent from './markdown/MarkdownPreview';
import schema from './markdown/schema';
import EditorPreview from './widgets/editor/EditorPreview';
import EditorWidget from './widgets/editor/EditorWidget';
import ScheduleWidget from './widgets/times/ScheduleWidget';

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

    cmsApp.registerWidget('times', ScheduleWidget);
    (cmsApp.registerWidget as any)('markdown', controlComponent, previewComponent, schema);
    cmsApp.registerWidget('html', EditorWidget, EditorPreview);

    cmsApp.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap');
    cmsApp.registerPreviewStyle('/styles/content.module.css');
    cmsApp.registerPreviewTemplate('posts', PostPreview);
    cmsApp.registerPreviewTemplate('pages', PagePreview);
    cmsApp.registerPreviewTemplate('homepage', HomePagePreview);
    cmsApp.registerPreviewTemplate('times', SchedulePreview);
    cmsApp.registerPreviewTemplate('church_details', ChurchDetailsPreview);
    cmsApp.registerPreviewTemplate('bulletins', BulletinsPreview);
  }, []);

  return <div />;
};

export default CMSView;
