import { format, parseISO } from 'date-fns';

import PageLayout from '../../../components/PageLayout';
import ParishBulletinsView from '../../../components/pages/custom/bulletins/ParishBulletinsView';
import { fetchBulletinMetaData, fetchBulletins } from '../../../lib/bulletins';
import { generateBasicMeta } from '../../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../../meta/TwitterCardMeta';
import { isNotNullish } from '../../../util/null.util';

import type { Metadata } from 'next/types';
import type { Bulletin, PageProps } from '../../../interface';

const title = 'Parish Bulletins';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const date = (await params).date as string;
  const url = `/parish-bulletins/${date}`;

  return {
    ...generateBasicMeta({ url, title }),
    ...generateOpenGraphMeta({ url, title }),
    ...generateTwitterCardMeta({ url, title })
  };
}

const buildDateToBulletin = async () => {
  const hash: Record<string, Bulletin> = {};

  const bulletins = await fetchBulletins();

  bulletins.forEach((bulletin) => {
    if (!(bulletin.date in hash)) {
      hash[format(parseISO(bulletin.date), 'yyyy-MM-dd')] = bulletin;
    }
  });
  return hash;
};

let dateToBulletin: Record<string, Bulletin> | null = null;

export const generateStaticParams = async (): Promise<Record<string, unknown>[]> => {
  const bulletins = await fetchBulletins();
  return bulletins.map((bulletin) => ({ date: format(parseISO(bulletin.date), 'yyyy-MM-dd') }));
};

const ParishBulletin = async ({ params }: PageProps) => {
  const date = (await params).date as string;

  if (process.env.NODE_ENV === 'development' || dateToBulletin == null) {
    dateToBulletin = await buildDateToBulletin();
  }

  const bulletin = dateToBulletin[date];
  const bulletins = await fetchBulletins();
  const meta = await fetchBulletinMetaData(bulletin);

  return (
    <PageLayout url={`/parish-bulletins/${bulletin.date}`} title={title} hideSidebar hideHeader>
      {isNotNullish(bulletin) && isNotNullish(meta) ? (
        <ParishBulletinsView bulletins={bulletins} bulletin={bulletin} meta={meta} />
      ) : (
        <p>Bulletin not found</p>
      )}
    </PageLayout>
  );
};

export default ParishBulletin;
