import PageLayout from '../../components/PageLayout';
import MassTimes from '../../components/pages/custom/mass-times/mass-times';
import { getSidebarProps } from '../../lib/sidebar';
import times from '../../lib/times';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';

const url = '/mass-confession-times';
const title = 'Mass &amp; Confession Times';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const MassConfessionTimes = async () => {
  const sidebarProps = await getSidebarProps();

  return (
    <PageLayout url={url} title={title} {...sidebarProps} hideHeader>
      <MassTimes times={times} />
    </PageLayout>
  );
};

export default MassConfessionTimes;
