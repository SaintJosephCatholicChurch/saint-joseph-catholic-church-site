import PageLayout from '../../components/PageLayout';
import EventsPage from '../../components/pages/custom/events/EventsPage';
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
  return (
    <PageLayout url={url} title={title} hideHeader hideSidebar disablePadding>
      <EventsPage />
    </PageLayout>
  );
};

export default Events;
