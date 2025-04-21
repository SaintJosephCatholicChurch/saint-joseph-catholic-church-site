import PageLayout from '../../components/PageLayout';
import ContactView from '../../components/pages/custom/contact/ContactView';
import churchDetails from '../../lib/church_details';
import { generateBasicMeta } from '../../meta/BasicMeta';
import { generateOpenGraphMeta } from '../../meta/OpenGraphMeta';
import { generateTwitterCardMeta } from '../../meta/TwitterCardMeta';

import type { Metadata } from 'next';

const url = '/mass-confession-times';
const title = 'Contact';

export const metadata: Metadata = {
  ...generateBasicMeta({ url, title }),
  ...generateOpenGraphMeta({ url, title }),
  ...generateTwitterCardMeta({ url, title })
};

const Contact = () => {
  return (
    <PageLayout url={url} title={title} hideSidebar hideHeader fullWidth disableBottomMargin>
      <ContactView churchDetails={churchDetails} />
    </PageLayout>
  );
};

export default Contact;
