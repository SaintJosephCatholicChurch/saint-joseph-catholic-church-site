import { format, parseISO } from 'date-fns';

import { BULLETIN, NEWS, PAGE } from '../constants';
import churchDetails from '../lib/church_details';
import config from '../lib/config';
import { fetchBulletinMetaData, fetchBulletins, fetchBulletinsMetaData } from '../lib/bulletins';
import { fetchPageContent } from '../lib/pages';
import { countPosts, fetchPostContent, listPostContent } from '../lib/posts';
import staff from '../lib/staff';
import { getSidebarProps } from '../lib/sidebar';
import { listTags } from '../lib/tags';

import type { Bulletin, BulletinPDFData, PostContent, SearchableEntry } from '../interface';
import type { SidebarProps } from '../lib/sidebar';

export interface ContentPageProps extends SidebarProps {
  title: string;
  dateString: string;
  slug: string;
  description?: string;
  image?: string;
  tags: string[];
  content: string;
}

export interface SearchPageProps {
  searchableEntries: SearchableEntry[];
}

export interface NewsListingProps {
  allPosts: PostContent[];
  pagination: {
    start: number;
    total: number;
    current: number;
    pages: number;
  };
}

export interface NewsPostProps extends SidebarProps {
  title: string;
  image?: string;
  dateString: string;
  slug: string;
  tags: string[];
  description?: string;
  content: string;
}

export interface NewsTagProps {
  posts: PostContent[];
  tag: string;
  page?: string;
  pagination: {
    current: number;
    pages: number;
  };
}

export interface BulletinRouteProps {
  bulletin: Bulletin;
  bulletins: Bulletin[];
  meta: BulletinPDFData;
}

const buildPagination = (current: number, totalItems: number) => {
  const start = (current - 1) * config.posts_per_page;
  const end = start + config.posts_per_page;

  return {
    start,
    total: totalItems < end ? totalItems - start : config.posts_per_page,
    current,
    pages: Math.ceil(totalItems / config.posts_per_page)
  };
};

export const getContentPageStaticParams = () => {
  return fetchPageContent().map(({ data: { slug } }) => ({ page: slug }));
};

export const getContentPageProps = (slug: string): ContentPageProps | undefined => {
  const pageContent = fetchPageContent().find(({ data }) => data.slug === slug);

  if (!pageContent) {
    return undefined;
  }

  const { content, data } = pageContent;

  return {
    title: data.title,
    dateString: data.date,
    slug: data.slug,
    description: '',
    image: data.image,
    tags: data.tags ?? [],
    content,
    ...getSidebarProps()
  };
};

export const getSearchPageProps = (): SearchPageProps => {
  return {
    searchableEntries: [
      ...fetchPageContent().map(({ data: { title, slug }, content, summary }) => ({
        title,
        content,
        summary,
        url: `/${slug}`,
        type: PAGE
      })),
      ...fetchPostContent().map(({ data: { title, slug, date }, content, summary }) => ({
        title,
        subtitle: format(parseISO(date), 'LLLL d, yyyy'),
        content,
        summary,
        url: `/news/${slug}`,
        type: NEWS,
        date
      })),
      ...fetchBulletinsMetaData().map(({ title, text, slug, date }) => ({
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
      }
    ]
  };
};

export const getNewsIndexProps = (): NewsListingProps => {
  const allPosts = fetchPostContent();
  const postCount = countPosts();

  return {
    allPosts,
    pagination: buildPagination(1, postCount)
  };
};

export const getNewsPageStaticParams = () => {
  const pages = Math.ceil(countPosts() / config.posts_per_page);
  return Array.from(Array(Math.max(pages - 1, 0)).keys()).map((index) => ({ page: `${index + 2}` }));
};

export const getNewsPageProps = (rawPage: string): NewsListingProps | undefined => {
  const page = parseInt(rawPage, 10);
  const totalPosts = countPosts();
  const totalPages = Math.ceil(totalPosts / config.posts_per_page);

  if (!Number.isFinite(page) || page < 2 || page > totalPages) {
    return undefined;
  }

  return {
    allPosts: fetchPostContent(),
    pagination: buildPagination(page, totalPosts)
  };
};

export const getNewsPostStaticParams = () => {
  return fetchPostContent().map(({ data: { slug } }) => ({ post: slug }));
};

export const getNewsPostProps = (slug: string): NewsPostProps | undefined => {
  const postContent = fetchPostContent().find((post) => post.data.slug === slug);

  if (!postContent) {
    return undefined;
  }

  const { content, data } = postContent;

  return {
    title: data.title,
    image: data.image ?? '',
    dateString: data.date,
    slug: data.slug,
    description: '',
    tags: data.tags ?? [],
    content,
    ...getSidebarProps()
  };
};

export const getNewsTagStaticParams = () => {
  return listTags().flatMap((tag) => {
    const pages = Math.ceil(countPosts(tag) / config.posts_per_page);

    return Array.from(Array(pages).keys()).map((pageIndex) =>
      pageIndex === 0 ? { tag: [tag] } : { tag: [tag, `${pageIndex + 1}`] }
    );
  });
};

export const getNewsTagProps = (tagSegments: string[] | undefined): NewsTagProps | undefined => {
  if (!tagSegments || tagSegments.length === 0 || tagSegments.length > 2) {
    return undefined;
  }

  const [tag, page] = tagSegments;
  const current = page ? parseInt(page, 10) : 1;
  const pages = Math.ceil(countPosts(tag) / config.posts_per_page);

  if (!Number.isFinite(current) || current < 1 || current > pages) {
    return undefined;
  }

  const props: NewsTagProps = {
    posts: listPostContent(current, config.posts_per_page, tag),
    tag,
    pagination: {
      current,
      pages
    }
  };

  if (page) {
    props.page = page;
  }

  return props;
};

const formatBulletinDate = (date: string) => format(parseISO(date), 'yyyy-MM-dd');

export const getBulletinStaticParams = () => {
  return fetchBulletins()
    .filter((bulletin): bulletin is Bulletin & { date: string } => Boolean(bulletin.date))
    .map((bulletin) => ({ date: formatBulletinDate(bulletin.date) }));
};

export const getBulletinRedirectPath = () => {
  const latestBulletin = fetchBulletins().find((bulletin): bulletin is Bulletin & { date: string } =>
    Boolean(bulletin.date)
  );

  if (!latestBulletin) {
    return undefined;
  }

  return `/parish-bulletins/${formatBulletinDate(latestBulletin.date)}`;
};

export const getBulletinProps = (date: string): BulletinRouteProps | undefined => {
  const bulletins = fetchBulletins();
  const bulletin = bulletins.find((entry) => entry.date && formatBulletinDate(entry.date) === date);

  if (!bulletin) {
    return undefined;
  }

  const meta = fetchBulletinMetaData(bulletin);

  if (!meta) {
    return undefined;
  }

  return {
    bulletin,
    bulletins,
    meta
  };
};
