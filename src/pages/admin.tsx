import dynamic from 'next/dynamic';

const Admin = () => {
  const DynamicComponentWithNoSSR = dynamic(() => import('../cms/CMSView'), {
    ssr: false
  });

  return <DynamicComponentWithNoSSR />;
};

export default Admin;
