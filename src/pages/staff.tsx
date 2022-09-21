import PageLayout from '../components/PageLayout';
import StaffView from '../components/pages/custom/staff/StaffView';
import { getRecentPostsStaticProps, RecentPostsProps } from '../lib/posts';
import staff from '../lib/staff';

type StaffProps = RecentPostsProps;

const Staff = ({ recentPosts }: StaffProps) => {
  return (
    <PageLayout url="/staff" title="Parish Staff" recentPosts={recentPosts}>
      <StaffView staff={staff} />
    </PageLayout>
  );
};

export default Staff;

export const getStaticProps = getRecentPostsStaticProps;
