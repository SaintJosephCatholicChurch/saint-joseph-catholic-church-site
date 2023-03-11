import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Admin = () => {
  const DynamicComponentWithNoSSR = useMemo(
    () =>
      dynamic(() => import('../cms/CMSView'), {
        ssr: false
      }),
    []
  );

  return useMemo(() => <DynamicComponentWithNoSSR key="admin" />, [DynamicComponentWithNoSSR]);
};

export default Admin;
