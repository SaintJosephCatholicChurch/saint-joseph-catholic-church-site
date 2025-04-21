'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const AdminPage = () => {
  const DynamicComponentWithNoSSR = useMemo(
    () =>
      dynamic(() => import('../../../../cms/CMSView'), {
        ssr: false
      }),
    []
  );

  return useMemo(() => <DynamicComponentWithNoSSR key="admin" />, [DynamicComponentWithNoSSR]);
};

export default AdminPage;
