import dynamic from 'next/dynamic';
import PageLayout from '../../components/PageLayout';

const Events = () => {
  const CalendarViewNoSSR = dynamic(() => import('../../components/events/CalendarView'), {
    ssr: false
  });

  return (
    <PageLayout url="/events" title="Events" showHeader={false} showSidebar={false} disablePadding>
      <CalendarViewNoSSR />
    </PageLayout>
  );
};

export default Events;
