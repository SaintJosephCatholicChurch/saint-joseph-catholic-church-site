import {
  faCalendarDays,
  faChurch,
  faCircleQuestion,
  faClipboardQuestion,
  faFileLines,
  faGear,
  faHouse,
  faNewspaper,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

import '@staticcms/core/node_modules/react-datetime/css/react-datetime.css';
import ChurchDetailsPreview from '../components/previews/ChurchDetailsPreview';
import HomePagePreview from '../components/previews/HomePagePreview';
import NavigationPreview from '../components/previews/NavigationPreview';
import PagePreview from '../components/previews/PagePreview';
import PostPreview from '../components/previews/PostPreview';
import SchedulePreview from '../components/previews/SchedulePreview';
import StaffPreview from '../components/previews/StaffPreview';
import loadCmsApp from './CMSApp';
import config from './config';
import Help from './pages/help/Help';
import EditorPreview from './widgets/editor/EditorPreview';
import EditorWidget from './widgets/editor/EditorWidget';
import ScheduleWidget from './widgets/times/TimesWidget';

import type { CmsConfig, CmsWidgetPreviewProps } from '@staticcms/core';
import type { ComponentType } from 'react';

const CMSView = () => {
  useEffect(() => {
    const root = document.getElementById('cms');
    if (root) {
      return;
    }

    const cmsApp = loadCmsApp();
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
    cmsApp.registerPreviewTemplate('news', PostPreview);
    cmsApp.registerPreviewTemplate('pages', PagePreview);
    cmsApp.registerPreviewTemplate('homepage', HomePagePreview);
    cmsApp.registerPreviewTemplate('times', SchedulePreview);
    cmsApp.registerPreviewTemplate('church_details', ChurchDetailsPreview);
    cmsApp.registerPreviewTemplate('staff', StaffPreview);
    cmsApp.registerPreviewTemplate('menu', NavigationPreview);

    cmsApp.registerIcon('house', <FontAwesomeIcon icon={faHouse} size="lg" />);
    cmsApp.registerIcon('church', <FontAwesomeIcon icon={faChurch} size="lg" />);
    cmsApp.registerIcon('tag', <FontAwesomeIcon icon={faTag} size="lg" />);
    cmsApp.registerIcon('file-lines', <FontAwesomeIcon icon={faFileLines} size="lg" />);
    cmsApp.registerIcon('gear', <FontAwesomeIcon icon={faGear} size="lg" />);
    cmsApp.registerIcon('calendar-days', <FontAwesomeIcon icon={faCalendarDays} size="lg" />);
    cmsApp.registerIcon('clipboard-question', <FontAwesomeIcon icon={faClipboardQuestion} size="lg" />);
    cmsApp.registerIcon('newspaper', <FontAwesomeIcon icon={faNewspaper} size="lg" />);
    cmsApp.registerIcon('circle-question', <FontAwesomeIcon icon={faCircleQuestion} size="lg" />);

    cmsApp.registerAdditionalLink(
      'events',
      'Events (Google Calendar)',
      'https://calendar.google.com/',
      'calendar-days'
    );
    cmsApp.registerAdditionalLink(
      'google-drive',
      'Forms (Google Drive)',
      'https://drive.google.com/',
      'clipboard-question'
    );
    cmsApp.registerAdditionalLink('help', 'Help', Help, 'circle-question');
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
};

CMSView.displayName = 'CMSView';

export default CMSView;
