import PageLayout from '../components/PageLayout';
import StaffView from '../components/pages/custom/staff/StaffView';
import { getSidebarStaticProps, SidebarProps } from '../lib/sidebar';
import staff from '../lib/staff';

type StaffProps = SidebarProps;

const Staff = ({ ...sidebarProps }: StaffProps) => {
  return (
    <PageLayout url="/staff" title="Parish Staff" {...sidebarProps}>
      <StaffView staff={staff} />
    </PageLayout>
  );
};

export default Staff;

export const getStaticProps = getSidebarStaticProps;
