import {
  faCalendarDays,
  faChurch,
  faCircleQuestion,
  faClipboardQuestion,
  faFileLines,
  faGear,
  faHouse,
  faNewspaper,
  faTag,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';
import CMS from '@staticcms/lite';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

import { ADMIN_BASE_PATH } from '../admin/adminConfig';
import ChurchDetailsPreview from '../components/previews/ChurchDetailsPreview';
import HomePagePreview from '../components/previews/HomePagePreview';
import NavigationPreview from '../components/previews/NavigationPreview';
import PagePreview from '../components/previews/PagePreview';
import PostPreview from '../components/previews/PostPreview';
import SchedulePreview from '../components/previews/SchedulePreview';
import StaffPreview from '../components/previews/StaffPreview';
import config from './config';
import Help from './pages/help/Help';
import NewAdminRedirect from './pages/new-admin/NewAdminRedirect';
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
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [showAdminSwitchPill, setShowAdminSwitchPill] = useState(false);

  useEffect(() => {
    const target = document.createElement('div');
    target.id = 'legacy-admin-switch-control';
    document.body.appendChild(target);
    setPortalTarget(target);

    function updatePillVisibility() {
      setShowAdminSwitchPill(!window.location.hash);
    }

    function cleanup() {
      window.removeEventListener('hashchange', updatePillVisibility);
      target.remove();
    }

    window.addEventListener('hashchange', updatePillVisibility);
    updatePillVisibility();

    if (cmsInitialized) {
      return cleanup;
    }

    const root = document.getElementById('cms');
    if (root) {
      cmsInitialized = true;
      return cleanup;
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
    CMS.registerIcon('new-admin', () => <CmsFontAwesomeIcon icon={faWandMagicSparkles} />);

    CMS.registerAdditionalLink({
      id: 'new-admin',
      title: 'Try the New Admin',
      data: NewAdminRedirect,
      options: {
        icon: 'new-admin'
      }
    });
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
    return cleanup;
  }, []);

  return (
    <>
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
      {portalTarget && showAdminSwitchPill
        ? createPortal(
            <>
              <a className="new-admin-pill" href={ADMIN_BASE_PATH}>
                Try the new admin
              </a>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <style jsx>{`
                .new-admin-pill {
                  position: fixed;
                  z-index: 50;
                  bottom: 16px;
                  left: 16px;
                  padding: 8px 14px;
                  border-radius: 999px;
                  background: #7f232c;
                  color: #fff;
                  font-size: 0.875rem;
                  font-weight: 600;
                  line-height: 1.4;
                  text-decoration: none;
                  box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
                }

                .new-admin-pill:hover,
                .new-admin-pill:focus-visible {
                  background: #5c1820;
                  color: #fff;
                }

                @media (max-width: 767px) {
                  .new-admin-pill {
                    bottom: 80px;
                  }
                }
              `}</style>
            </>,
            portalTarget
          )
        : null}
    </>
  );
};

CMSView.displayName = 'CMSView';

export default CMSView;
