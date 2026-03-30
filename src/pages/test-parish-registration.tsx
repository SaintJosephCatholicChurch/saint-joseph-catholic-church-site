import PageLayout from '../components/PageLayout';
import ParishRegistrationView from '../components/pages/custom/parish-membership/ParishRegistrationView';
import { getSidebarStaticProps } from '../lib/sidebar';

import type { SidebarProps } from '../lib/sidebar';

type ParishMembershipProps = SidebarProps;

const ParishMembership = ({ ...sidebarProps }: ParishMembershipProps) => {
  return (
    <PageLayout url="/test-parish-registration" title="Parish Membership" {...sidebarProps}>
      <ParishRegistrationView />
    </PageLayout>
  );
};

export default ParishMembership;

export const getStaticProps = getSidebarStaticProps;
