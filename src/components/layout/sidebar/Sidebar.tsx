import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import type { DailyReadings as DailyReadingsDetails, PostContent } from '../../../interface';

interface SidebarProps {
  recentPosts?: PostContent[];
  dailyReadings?: DailyReadingsDetails;
  hideSearch?: boolean;
}

const Sidebar = ({ recentPosts, dailyReadings, hideSearch }: SidebarProps) => {
  const SidebarNoSSR = useMemo(
    () =>
      dynamic(() => import('./SidebarContent'), {
        ssr: false
      }),
    []
  );

  return <SidebarNoSSR recentPosts={recentPosts} dailyReadings={dailyReadings} hideSearch={hideSearch} />;
};

export default Sidebar;
