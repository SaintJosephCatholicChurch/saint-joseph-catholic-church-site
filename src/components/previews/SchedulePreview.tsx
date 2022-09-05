import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useCallback, useMemo, useState } from 'react';
import type { Times } from '../../interface';
import ScheduleTabChangeEvent from '../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../util/window.util';
import Schedule from '../schedule/Schedule';

const SchedulePreview = ({ entry }: PreviewTemplateComponentProps) => {
  const data = useMemo(() => entry.toJS().data.times as Times[], [entry]);
  const [tab, setTab] = useState(0);

  const handleTabChange = useCallback((index: number) => {
    window.dispatchEvent(new ScheduleTabChangeEvent(index));
  }, []);

  const handleTabChangeEvent = useCallback((event: ScheduleTabChangeEvent) => {
    setTab(event.detail);
  }, []);

  useWindowEvent('scheduleTabChange', handleTabChangeEvent, parent.window);

  return useMemo(() => <Schedule times={data} tab={tab} onTabChange={handleTabChange} />, [data, handleTabChange, tab]);
};

export default SchedulePreview;
