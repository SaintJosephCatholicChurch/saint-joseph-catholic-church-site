import PageLayout from '../components/PageLayout';
import ContactView from '../components/pages/custom/contact/ContactView';
import churchDetails from '../lib/church_details';

const Contact = () => {
  return (
    <PageLayout url="/mass-confession-times" title="Contact" hideSidebar hideHeader fullWidth disableBottomMargin>
      <ContactView churchDetails={churchDetails} />
    </PageLayout>
  );
};

export default Contact;
