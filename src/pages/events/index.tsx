import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import PageLayout from '../../components/PageLayout';

const Events = () => {
  const CalendarViewNoSSR = useMemo(
    () =>
      dynamic(() => import('../../components/events/CalendarView'), {
        ssr: false
      }),
    []
  );

  return (
    <PageLayout url="/events" title="Events" hideHeader hideSidebar disablePadding>
      <CalendarViewNoSSR />
    </PageLayout>
  );
};

export default Events;
