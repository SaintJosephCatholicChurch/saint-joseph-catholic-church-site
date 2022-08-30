import ParishBulletinsView from '../components/pages/custom/ParishBulletinsView';
import PageLayout from '../components/pages/PageLayout';
import bulletins from '../lib/bulletins';

const ParishBulletins = () => {
  return (
    <PageLayout title="Parish Bulletins">
      <ParishBulletinsView bulletins={bulletins} />
    </PageLayout>
  );
};

export default ParishBulletins;
