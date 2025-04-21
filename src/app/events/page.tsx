import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import PageLayout from '../../components/PageLayout';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';

const url = '/events';
const title = 'Events';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const Events = () => {
  const CalendarViewNoSSR = useMemo(
    () =>
      dynamic(() => import('../../components/events/CalendarView'), {
        ssr: false
      }),
    []
  );

  return (
    <PageLayout url={url} title={title} hideHeader hideSidebar disablePadding>
      <CalendarViewNoSSR />
    </PageLayout>
  );
};

export default Events;
