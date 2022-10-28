import { RECENT_NEWS_TO_SHOW } from '../constants';
import homepageData from './homepage';
import { listPostContent } from './posts';

import type { GetStaticProps } from 'next';
import type { DailyReadings, PostContent } from '../interface';

export interface SidebarProps {
  recentPosts: PostContent[];
  dailyReadings: DailyReadings;
}

export const getSidebarProps = (): SidebarProps => {
  return {
    recentPosts: listPostContent(1, RECENT_NEWS_TO_SHOW),
    dailyReadings: homepageData.daily_readings
  };
};

export const getSidebarStaticProps: GetStaticProps = (): { props: SidebarProps } => {
  return {
    props: {
      ...getSidebarProps()
    }
  };
};
