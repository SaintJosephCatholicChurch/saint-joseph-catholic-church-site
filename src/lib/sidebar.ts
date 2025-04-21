import { RECENT_NEWS_TO_SHOW } from '../constants';
import homepageData from './homepage';
import { listPostContent } from './posts';

import type { DailyReadings, PostContent } from '../interface';

export interface SidebarProps {
  recentPosts: PostContent[];
  dailyReadings: DailyReadings;
}

export const getSidebarProps = async (): Promise<SidebarProps> => {
  return {
    recentPosts: await listPostContent(1, RECENT_NEWS_TO_SHOW),
    dailyReadings: homepageData.daily_readings
  };
};
