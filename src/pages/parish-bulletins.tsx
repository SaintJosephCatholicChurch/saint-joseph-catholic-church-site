import PageLayout from '../components/PageLayout';
import ParishBulletinsView from '../components/pages/custom/ParishBulletinsView';
import bulletins from '../lib/bulletins';

const ParishBulletins = () => {
  return (
    <PageLayout url="/parish-bulletins" title="Parish Bulletins" showSidebar={false}>
      <ParishBulletinsView bulletins={bulletins} />
    </PageLayout>
  );
};

export default ParishBulletins;
