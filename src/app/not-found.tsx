import PageLayout from '../components/PageLayout';
import PageContentView from '../components/pages/PageContentView';
import SearchBox from '../components/SearchBox';
import { getSidebarProps } from '../lib/sidebar';
import { generateBasicMeta } from '../meta/BasicMeta';
import { generateOpenGraphMeta } from '../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../meta/TwitterCardMeta';

import type { Metadata } from 'next/types';

const url = '/404';
const title = 'Page not found';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const NotFoundPage = async () => {
  const sidebarProps = await getSidebarProps();

  return (
    <PageLayout url={url} title={title} {...sidebarProps}>
      <PageContentView>
        <p>Sorry, the page you are looking for was either not found or does not exist.</p>
        <p>Try searching below or return to the home page.</p>
      </PageContentView>
      <SearchBox value="" disableMargin />
    </PageLayout>
  );
};

export default NotFoundPage;
