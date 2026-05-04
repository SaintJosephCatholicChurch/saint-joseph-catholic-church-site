'use client';

import { useEffect } from 'react';

import { disableReactDevTools } from '../util/devtools.util';

const AppClientBootstrap = (): null => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      disableReactDevTools();
    }
  }, []);

  return null;
};

export default AppClientBootstrap;
