import PageLayout from '../components/PageLayout';
import StaffView from '../components/pages/custom/staff/StaffView';
import { getSidebarStaticProps } from '../lib/sidebar';
import staff from '../lib/staff';

import type { SidebarProps } from '../lib/sidebar';

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
