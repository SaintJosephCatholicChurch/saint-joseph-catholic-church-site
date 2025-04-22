import PageLayout from '../../components/PageLayout';
import ParishBulletinsView from '../../components/pages/custom/bulletins/ParishBulletinsView';
import { fetchBulletinMetaData, fetchBulletins } from '../../lib/bulletins';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';
import { isNotNullish } from '../../util/null.util';

import type { Metadata } from 'next';
import type { Bulletin } from '../../interface';

const url = '/parish-bulletins';
const title = 'Parish Bulletins';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const ParishBulletin = async () => {
  let bulletin: Bulletin | undefined;

  const bulletins = await fetchBulletins();
  if (bulletins.length > 0) {
    bulletin = bulletins[0];
  }

  const meta = await fetchBulletinMetaData(bulletin);

  return (
    <PageLayout url={url} title={title} hideSidebar hideHeader>
      {isNotNullish(bulletin) && isNotNullish(meta) ? (
        <ParishBulletinsView bulletins={bulletins} bulletin={bulletin} meta={meta} />
      ) : (
        <p>Bulletin not found</p>
      )}
    </PageLayout>
  );
};

export default ParishBulletin;
