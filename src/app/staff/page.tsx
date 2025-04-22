import PageLayout from '../../components/PageLayout';
import StaffView from '../../components/pages/custom/staff/StaffView';
import { getSidebarProps } from '../../lib/sidebar';
import staff from '../../lib/staff';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';

const url = '/staff';
const title = 'Parish Staff';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const Staff = async () => {
  const sidebarProps = await getSidebarProps();

  return (
    <PageLayout url={url} title={title} {...sidebarProps}>
      <StaffView staff={staff} />
    </PageLayout>
  );
};

export default Staff;
