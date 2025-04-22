import { format, parseISO } from 'date-fns';

import PageLayout from '../../components/PageLayout';
import SearchPage from '../../components/pages/custom/search/SearchPage';
import { BULLETIN, NEWS, PAGE } from '../../constants';
import { fetchBulletinsMetaData } from '../../lib/bulletins';
import churchDetails from '../../lib/church_details';
import { fetchPageContent } from '../../lib/pages';
import { fetchPostContent } from '../../lib/posts';
import staff from '../../lib/staff';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';
import type { SearchEntry } from '../../components/pages/custom/search/SearchPage';

const url = '/search';
const title = 'Search';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const Search = async () => {
  const pages = await fetchPageContent();
  const posts = await fetchPostContent();
  const bulletins = await fetchBulletinsMetaData();

  const searchableEntries: SearchEntry[] = [
    ...pages.map(({ data: { title, slug }, content, summary }) => ({
      title,
      content,
      summary,
      url: `/${slug}`,
      type: PAGE
    })),
    ...posts.map(({ data: { title, slug, date }, content, summary }) => ({
      title,
      subtitle: format(parseISO(date), 'LLLL d, yyyy'),
      content,
      summary,
      url: `/news/${slug}`,
      type: NEWS,
      date
    })),
    ...bulletins.map(({ title, text, slug, date }) => ({
      title,
      content: text,
      url: `/parish-bulletins/${slug}`,
      type: BULLETIN,
      date
    })),
    {
      title: 'Live Stream',
      content: 'live stream facebook',
      url: '/live-stream',
      type: PAGE,
      priority: true,
      showSummary: false
    },
    {
      title: 'Mass & Confession Times',
      content: 'mass times confession times adoration times stations of the cross parish office hours schedule',
      url: '/mass-confession-times',
      type: PAGE,
      priority: true,
      showSummary: false
    },
    {
      title: 'Contact',
      content: `contact church phone number church email church address where to find us ${(
        churchDetails.additional_emails ?? []
      )
        .map(({ name }) => name)
        .join(' ')} ${(churchDetails.additional_phones ?? []).map(({ name }) => name).join(' ')} ${(
        churchDetails.contacts ?? []
      )
        .map(({ title, name }) => `${title} ${name}`)
        .join(' ')}`,
      url: '/contact',
      type: PAGE,
      priority: true,
      showSummary: false
    },
    {
      title: 'Events Calendar',
      content: 'events calendar event schedule upcoming events',
      url: '/events',
      type: PAGE,
      priority: true,
      showSummary: false
    },
    {
      title: 'Parish Staff',
      content: `parish staff ${(staff ?? []).map(({ title, name }) => `${title} ${name}`).join(' ')}`,
      url: '/staff',
      type: PAGE,
      priority: true,
      showSummary: false
    },
    {
      title: 'News',
      content: `recents news articles`,
      url: '/news',
      type: PAGE,
      priority: true,
      showSummary: false
    },
    {
      title: 'Parish Bulletins',
      content: `parish bulletins news`,
      url: '/parish-bulletins',
      type: PAGE,
      priority: true,
      showSummary: false
    }
  ];

  return (
    <PageLayout url={url} title={title} hideSearch>
      <SearchPage searchableEntries={searchableEntries} />
    </PageLayout>
  );
};

export default Search;
