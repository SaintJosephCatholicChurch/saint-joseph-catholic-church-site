import { useCallback, useMemo, useState } from 'react';

import ScheduleTabChangeEvent from '../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../util/window.util';
import ScheduleWidget from '../schedule/ScheduleWidget';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { Times } from '../../interface';

const SchedulePreview: TemplatePreviewComponent<{ times: Times[] }> = ({ entry }) => {
  const [tab, setTab] = useState(0);

  const handleTabChange = useCallback((index: number) => {
    window.dispatchEvent(new ScheduleTabChangeEvent(index));
  }, []);

  const handleTabChangeEvent = useCallback((event: ScheduleTabChangeEvent) => {
    setTab(event.detail);
  }, []);

  useWindowEvent('scheduleTabChange', handleTabChangeEvent, parent.window);

  return useMemo(
    () => <ScheduleWidget times={entry.data.times} tab={tab} onTabChange={handleTabChange} />,
    [entry.data.times, handleTabChange, tab]
  );
};

export default SchedulePreview;
