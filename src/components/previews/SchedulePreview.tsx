import { styled } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';

import ScheduleTabChangeEvent from '../../util/events/ScheduleTabChangeEvent';
import { useWindowEvent } from '../../util/window.util';
import ScheduleWidget from '../schedule/ScheduleWidget';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { Times } from '../../interface';

const StyledScheduleWrapper = styled('div')`
  container: page / inline-size;
  font-family: Open Sans,Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  background-color: #f5f4f3;
  color: #222;
  font-weight: 200;
  font-size: 16px;
`;

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
    () => (
      <StyledScheduleWrapper>
        <ScheduleWidget times={entry.data.times} tab={tab} onTabChange={handleTabChange} />
      </StyledScheduleWrapper>
    ),
    [entry.data.times, handleTabChange, tab]
  );
};

export default SchedulePreview;
