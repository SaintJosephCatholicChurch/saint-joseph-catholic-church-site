'use client';

import { useEffect, useState } from 'react';

import { RECENT_NEWS_TO_SHOW } from '../constants';
import HomepageView from '../components/homepage/HomepageView';
import times from '../lib/times';
import { AdminPagePreviewFrame } from './AdminPagePreviewFrame';
import { buildHomepagePreviewData, type HomepageDraft } from './content/writableComplexContent';
import { getLoadedRecentPostContent } from './content/writableDocumentsContent';
import { useAdminAuth } from './AdminAuthProvider';

import type { PostContent } from '../interface';

interface HomepagePreviewProps {
  draft: HomepageDraft;
}

export function HomepagePreview({ draft }: HomepagePreviewProps) {
  const { repoClient } = useAdminAuth();
  const [recentPosts, setRecentPosts] = useState<PostContent[]>([]);

  useEffect(() => {
    if (!repoClient) {
      setRecentPosts([]);
      return;
    }

    setRecentPosts(getLoadedRecentPostContent(repoClient, RECENT_NEWS_TO_SHOW));
  }, [repoClient]);

  return (
    <AdminPagePreviewFrame>
      <HomepageView homePageData={buildHomepagePreviewData(draft)} times={times} recentPosts={recentPosts} hideSearch />
    </AdminPagePreviewFrame>
  );
}
