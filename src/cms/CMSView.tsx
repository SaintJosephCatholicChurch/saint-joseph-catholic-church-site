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
import CMS from '@staticcms/lite';
import { useEffect } from 'react';

import ChurchDetailsPreview from '../components/previews/ChurchDetailsPreview';
import HomePagePreview from '../components/previews/HomePagePreview';
import NavigationPreview from '../components/previews/NavigationPreview';
import PagePreview from '../components/previews/PagePreview';
import PostPreview from '../components/previews/PostPreview';
import SchedulePreview from '../components/previews/SchedulePreview';
import StaffPreview from '../components/previews/StaffPreview';
import config from './config';
import Help from './pages/help/Help';
import EditorControl from './widgets/editor/EditorControl';
import EditorPreview from './widgets/editor/EditorPreview';
import ScheduleWidget from './widgets/times/TimesWidget';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import '@staticcms/lite/dist/main.css';

let cmsInitialized = false;

const CmsFontAwesomeIcon = ({ icon }: { icon: IconDefinition }) => {
  const [width, height, , , svgPathData] = icon.icon;
  const paths = Array.isArray(svgPathData) ? svgPathData : [svgPathData];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '1.25rem', height: '1.25rem' }}
    >
      {paths.map((path, index) => (
        <path key={`${icon.iconName}-${index}`} fill="currentColor" d={path} />
      ))}
    </svg>
  );
};

const CMSView = () => {
  useEffect(() => {
    if (cmsInitialized) {
      return;
    }

    const root = document.getElementById('cms');
    if (root) {
      cmsInitialized = true;
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      config.local_backend = true;
    }

    cmsInitialized = true;
    CMS.init({ config });

    CMS.registerWidget('times', ScheduleWidget);
    CMS.registerWidget('html', EditorControl, EditorPreview);

    CMS.registerPreviewStyle(
      'https://fonts.googleapis.com/css2?family=Lato&family=Open+Sans:wght@400;500;600&family=Oswald:wght@200;300;400;500;600;700&family=Roboto:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Ubuntu+Mono:wght@400;700&family=Ubuntu:wght@300;400;500&display=swap'
    );
    CMS.registerPreviewStyle('/styles/content.module.css');
    CMS.registerPreviewTemplate('news', PostPreview);
    CMS.registerPreviewTemplate('pages', PagePreview);
    CMS.registerPreviewTemplate('homepage', HomePagePreview);
    CMS.registerPreviewTemplate('times', SchedulePreview);
    CMS.registerPreviewTemplate('church_details', ChurchDetailsPreview);
    CMS.registerPreviewTemplate('staff', StaffPreview);
    CMS.registerPreviewTemplate('menu', NavigationPreview);

    CMS.registerIcon('house', () => <CmsFontAwesomeIcon icon={faHouse} />);
    CMS.registerIcon('church', () => <CmsFontAwesomeIcon icon={faChurch} />);
    CMS.registerIcon('tag', () => <CmsFontAwesomeIcon icon={faTag} />);
    CMS.registerIcon('file-lines', () => <CmsFontAwesomeIcon icon={faFileLines} />);
    CMS.registerIcon('gear', () => <CmsFontAwesomeIcon icon={faGear} />);
    CMS.registerIcon('calendar-days', () => <CmsFontAwesomeIcon icon={faCalendarDays} />);
    CMS.registerIcon('clipboard-question', () => <CmsFontAwesomeIcon icon={faClipboardQuestion} />);
    CMS.registerIcon('newspaper', () => <CmsFontAwesomeIcon icon={faNewspaper} />);
    CMS.registerIcon('circle-question', () => <CmsFontAwesomeIcon icon={faCircleQuestion} />);

    CMS.registerAdditionalLink({
      id: 'events',
      title: 'Events (Google Calendar)',
      data: 'https://calendar.google.com/',
      options: {
        icon: 'calendar-days'
      }
    });
    CMS.registerAdditionalLink({
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

        a:active,
        a:hover {
          color: unset;
        }
      `}</style>
    </div>
  );
};

CMSView.displayName = 'CMSView';

export default CMSView;
