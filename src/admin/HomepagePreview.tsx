'use client';

import { useEffect, useState } from 'react';

import { RECENT_NEWS_TO_SHOW } from '../constants';
import HomepageView from '../components/homepage/HomepageView';
import times from '../lib/times';
import { AdminPagePreviewFrame } from './AdminPagePreviewFrame';
import {
  ChurchSiteContentRepository,
  type AdminPostFrontmatter,
  type StoredDocument
} from './content/contentRepository';
import { buildHomepagePreviewData, type HomepageDraft } from './content/writableComplexContent';
import { useAdminAuth } from './AdminAuthProvider';

import type { PostContent } from '../interface';

const MOCK_RECENT_POSTS: PostContent[] = [
  {
    fullPath: '/preview/news/parish-mission-week.mdx',
    summary: '<p>Preview story content for the homepage admin preview.</p>',
    content: '',
    data: {
      date: '2026-04-20',
      title: 'Parish Mission Week',
      image: '/mocks/news_header.png',
      slug: 'parish-mission-week'
    }
  },
  {
    fullPath: '/preview/news/first-communion-sunday.mdx',
    summary: '<p>Preview story content for the homepage admin preview.</p>',
    content: '',
    data: {
      date: '2026-04-08',
      title: 'First Communion Sunday',
      image: '/mocks/news_header.png',
      slug: 'first-communion-sunday'
    }
  },
  {
    fullPath: '/preview/news/easter-brunch-volunteers.mdx',
    summary: '<p>Preview story content for the homepage admin preview.</p>',
    content: '',
    data: {
      date: '2026-03-30',
      title: 'Easter Brunch Volunteers',
      image: '/mocks/news_header.png',
      slug: 'easter-brunch-volunteers'
    }
  }
];

interface HomepagePreviewProps {
  draft: HomepageDraft;
}

function buildPostSummary(body: string) {
  const summaryRegex = /^<p>([\w\W]+?)<\/p>/i;
  let summaryMatch = summaryRegex.exec(body);

  const htmlSummaryRegex =
    /^([\s\n]*(?:<(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>(?:[\s\S])*?<\/(?:p|ul|ol|h1|h2|h3|h4|h5|h6|div)>[\s\n]*){1,2})/i;
  if (!summaryMatch || summaryMatch.length < 2) {
    summaryMatch = htmlSummaryRegex.exec(body);
  }

  return summaryMatch && summaryMatch.length >= 2 ? summaryMatch[1].replace(/<img([\w\W]+?)\/>/g, '') : body;
}

function toPostContent(document: StoredDocument<AdminPostFrontmatter>): PostContent {
  return {
    fullPath: document.path,
    summary: buildPostSummary(document.body),
    content: document.body,
    data: {
      date: document.data.date,
      title: document.data.title,
      image: document.data.image || '',
      slug: document.data.slug,
      tags: document.data.tags || []
    }
  };
}

export function HomepagePreview({ draft }: HomepagePreviewProps) {
  const { mode, repoClient } = useAdminAuth();
  const [recentPosts, setRecentPosts] = useState<PostContent[]>(() => (mode === 'preview' ? MOCK_RECENT_POSTS : []));

  useEffect(() => {
    if (mode === 'preview') {
      setRecentPosts(MOCK_RECENT_POSTS);
      return;
    }

    if (!repoClient) {
      setRecentPosts([]);
      return;
    }

    let alive = true;

    const loadRecentPosts = async () => {
      try {
        const repository = new ChurchSiteContentRepository(repoClient);
        const posts = await repository.listPosts();

        if (!alive) {
          return;
        }

        setRecentPosts(
          [...posts]
            .sort((left, right) => new Date(right.data.date).getTime() - new Date(left.data.date).getTime())
            .slice(0, RECENT_NEWS_TO_SHOW)
            .map(toPostContent)
        );
      } catch {
        if (!alive) {
          return;
        }

        setRecentPosts([]);
      }
    };

    void loadRecentPosts();

    return () => {
      alive = false;
    };
  }, [mode, repoClient]);

  return (
    <AdminPagePreviewFrame>
      <HomepageView homePageData={buildHomepagePreviewData(draft)} times={times} recentPosts={recentPosts} hideSearch />
    </AdminPagePreviewFrame>
  );
}
