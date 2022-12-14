import { useCallback, useMemo, useState } from 'react';

import ScheduleTabChangeEvent from '../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../util/window.util';
import ScheduleWidget from '../schedule/ScheduleWidget';

import type { PreviewTemplateComponentProps } from '@staticcms/core';
import type { Times } from '../../interface';

const SchedulePreview = ({ entry }: PreviewTemplateComponentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const data = useMemo(() => (entry.toJS().data.times ?? []) as Times[], [entry]);
  const [tab, setTab] = useState(0);

  const handleTabChange = useCallback((index: number) => {
    window.dispatchEvent(new ScheduleTabChangeEvent(index));
  }, []);

  const handleTabChangeEvent = useCallback((event: ScheduleTabChangeEvent) => {
    setTab(event.detail);
  }, []);

  useWindowEvent('scheduleTabChange', handleTabChangeEvent, parent.window);

  return useMemo(() => <ScheduleWidget times={data} tab={tab} onTabChange={handleTabChange} />, [data, handleTabChange, tab]);
};

export default SchedulePreview;
