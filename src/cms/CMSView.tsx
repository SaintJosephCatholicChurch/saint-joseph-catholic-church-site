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

import '@staticcms/core/dist/main.css';

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

    cmsApp.init({ config });

    cmsApp.registerWidget('times', ScheduleWidget);
    cmsApp.registerWidget('html', EditorWidget, EditorPreview);

    cmsApp.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap');
    cmsApp.registerPreviewStyle('/styles/content.module.css');
    cmsApp.registerPreviewTemplate('news', PostPreview);
    cmsApp.registerPreviewTemplate('pages', PagePreview);
    cmsApp.registerPreviewTemplate('homepage', HomePagePreview);
    cmsApp.registerPreviewTemplate('times', SchedulePreview);
    cmsApp.registerPreviewTemplate('church_details', ChurchDetailsPreview);
    cmsApp.registerPreviewTemplate('staff', StaffPreview);
    cmsApp.registerPreviewTemplate('menu', NavigationPreview);

    cmsApp.registerIcon('house', () => <FontAwesomeIcon icon={faHouse} size="lg" />);
    cmsApp.registerIcon('church', () => <FontAwesomeIcon icon={faChurch} size="lg" />);
    cmsApp.registerIcon('tag', () => <FontAwesomeIcon icon={faTag} size="lg" />);
    cmsApp.registerIcon('file-lines', () => <FontAwesomeIcon icon={faFileLines} size="lg" />);
    cmsApp.registerIcon('gear', () => <FontAwesomeIcon icon={faGear} size="lg" />);
    cmsApp.registerIcon('calendar-days', () => <FontAwesomeIcon icon={faCalendarDays} size="lg" />);
    cmsApp.registerIcon('clipboard-question', () => <FontAwesomeIcon icon={faClipboardQuestion} size="lg" />);
    cmsApp.registerIcon('newspaper', () => <FontAwesomeIcon icon={faNewspaper} size="lg" />);
    cmsApp.registerIcon('circle-question', () => <FontAwesomeIcon icon={faCircleQuestion} size="lg" />);

    cmsApp.registerAdditionalLink({
      id: 'events',
      title: 'Events (Google Calendar)',
      data: 'https://calendar.google.com/',
      options: {
        icon: 'calendar-days'
      }
    });
    cmsApp.registerAdditionalLink({
      id: 'google-drive',
      title: 'Forms (Google Drive)',
      data: 'https://drive.google.com/',
      options: {
        icon: 'clipboard-question'
      }
    });
    cmsApp.registerAdditionalLink({
      id: 'help',
      title: 'Help',
      data: Help,
      options: {
        icon: 'circle-question'
      }
    });
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
