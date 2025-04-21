import contentStyles from '../../../public/styles/content.module.css';
import PageLayout from '../../components/PageLayout';
import AskForm from '../../components/pages/custom/ask/AskForm';
import { getSidebarProps } from '../../lib/sidebar';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';

const url = '/ask';
const title = 'Did You Know? Question Submission';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const Ask = async () => {
  const sidebarProps = await getSidebarProps();

  return (
    <PageLayout url={url} title={title} {...sidebarProps}>
      <AskForm contentClassName={contentStyles.content} />
    </PageLayout>
  );
};

export default Ask;
