import { listPostContent } from './posts';
import { RECENT_NEWS_TO_SHOW } from '../constants';
import { DailyReadings, PostContent } from '../interface';
import { GetStaticProps } from 'next';
import homepageData from './homepage';

export interface SidebarProps {
  recentPosts: PostContent[];
  dailyReadings: DailyReadings;
}

export const getSidebarProps = (): SidebarProps => {
  return {
    recentPosts: listPostContent(1, RECENT_NEWS_TO_SHOW),
    dailyReadings: homepageData.daily_readings
  }
};

export const getSidebarStaticProps: GetStaticProps = (): { props: SidebarProps } => {
  return {
    props: {
      ...getSidebarProps()
    }
  };
};
