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
import useCollectionIcons from './hooks/useCollectionIcons';
import EditorPreview from './widgets/editor/EditorPreview';
import EditorWidget from './widgets/editor/EditorWidget';
import ScheduleWidget from './widgets/times/TimesWidget';

const CMSView = () => {
  useScript('https://kit.fontawesome.com/0636016ebf.js');

  useEffect(() => {
    if (!cmsApp) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      config.local_backend = true;
    }

    cmsApp.init({ config } as { config: CmsConfig });

    cmsApp.registerWidget('times', ScheduleWidget);
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

  useCollectionIcons([
    {
      name: 'homepage',
      icon: 'fa-solid fa-house'
    },
    {
      name: 'church',
      icon: 'fa-solid fa-church'
    },
    {
      name: 'meta',
      icon: 'fa-solid fa-tag'
    },
    {
      name: 'pages',
      icon: 'fa-solid fa-file-lines'
    },
    {
      name: 'config',
      icon: 'fa-solid fa-gear'
    }
  ]);

  return (
    <div>
      <style jsx global>{`
        #__next {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CMSView;
