import {
  faArrowUpRightFromSquare,
  faChurch,
  faFileLines,
  faGear,
  faHouse,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cmsApp from 'netlify-cms-app';
import { CmsConfig, CmsWidgetPreviewProps } from 'netlify-cms-core';
import { ComponentType, memo, useEffect } from 'react';
import BulletinsPreview from '../components/previews/BulletinsPreview';
import ChurchDetailsPreview from '../components/previews/ChurchDetailsPreview';
import HomePagePreview from '../components/previews/HomePagePreview';
import PagePreview from '../components/previews/PagePreview';
import PostPreview from '../components/previews/PostPreview';
import SchedulePreview from '../components/previews/SchedulePreview';
import StaffPreview from '../components/previews/StaffPreview';
import config from './config';
import EditorPreview from './widgets/editor/EditorPreview';
import EditorWidget from './widgets/editor/EditorWidget';
import ScheduleWidget from './widgets/times/TimesWidget';

const CMSView = memo(() => {
  useEffect(() => {
    if (!cmsApp) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      config.local_backend = true;
    }

    cmsApp.init({ config } as { config: CmsConfig });

    cmsApp.registerWidget('times', ScheduleWidget);
    cmsApp.registerWidget(
      'html',
      EditorWidget,
      EditorPreview as unknown as ComponentType<CmsWidgetPreviewProps<string>>
    );

    cmsApp.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap');
    cmsApp.registerPreviewStyle('/styles/content.module.css');
    cmsApp.registerPreviewTemplate('posts', PostPreview);
    cmsApp.registerPreviewTemplate('pages', PagePreview);
    cmsApp.registerPreviewTemplate('homepage', HomePagePreview);
    cmsApp.registerPreviewTemplate('times', SchedulePreview);
    cmsApp.registerPreviewTemplate('church_details', ChurchDetailsPreview);
    cmsApp.registerPreviewTemplate('bulletins', BulletinsPreview);
    cmsApp.registerPreviewTemplate('staff', StaffPreview);

    cmsApp.registerIcon('house', <FontAwesomeIcon icon={faHouse} size="lg" />);
    cmsApp.registerIcon('church', <FontAwesomeIcon icon={faChurch} size="lg" />);
    cmsApp.registerIcon('tag', <FontAwesomeIcon icon={faTag} size="lg" />);
    cmsApp.registerIcon('file-lines', <FontAwesomeIcon icon={faFileLines} size="lg" />);
    cmsApp.registerIcon('gear', <FontAwesomeIcon icon={faGear} size="lg" />);
    cmsApp.registerIcon('external-link', <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="lg" />);

    cmsApp.registerAdditionalLink('events', 'Events Calendar', 'https://calendar.google.com/', 'external-link');
  }, []);

  return (
    <div>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }

        #__next {
          display: none;
        }
      `}</style>
    </div>
  );
});

CMSView.displayName = 'CMSView';

export default CMSView;
