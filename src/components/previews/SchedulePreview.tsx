import { PreviewTemplateComponentProps } from '@simplecms/simple-cms-core';
import { useCallback, useMemo, useState } from 'react';
import type { Times } from '../../interface';
import ScheduleTabChangeEvent from '../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../util/window.util';
import ScheduleWidget from '../schedule/ScheduleWidget';

const SchedulePreview = ({ entry }: PreviewTemplateComponentProps) => {
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
