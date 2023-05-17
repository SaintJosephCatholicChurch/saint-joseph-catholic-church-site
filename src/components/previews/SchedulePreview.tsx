import { useCallback, useMemo, useState } from 'react';

import ScheduleTabChangeEvent from '../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../util/window.util';
import ScheduleWidget from '../schedule/ScheduleWidget';

import type { WidgetPreviewComponent } from '@staticcms/core';
import type { Times } from '../../interface';
import type { FC } from 'react';
import type { TimesField } from '../../cms/config';

const SchedulePreview: WidgetPreviewComponent<Times[], TimesField> = ({ value }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const data = useMemo(() => value ?? [], [value]);
  const [tab, setTab] = useState(0);

  const handleTabChange = useCallback((index: number) => {
    window.dispatchEvent(new ScheduleTabChangeEvent(index));
  }, []);

  const handleTabChangeEvent = useCallback((event: ScheduleTabChangeEvent) => {
    setTab(event.detail);
  }, []);

  useWindowEvent('scheduleTabChange', handleTabChangeEvent, parent.window);

  return useMemo(
    () => <ScheduleWidget times={data} tab={tab} onTabChange={handleTabChange} />,
    [data, handleTabChange, tab]
  );
};

export default SchedulePreview;
