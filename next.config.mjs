/** @type {import('next').NextConfig} */
const env = process.env.NODE_ENV || 'development';
const enablePWA = env === 'production' && process.env.NEXT_ENABLE_PWA === 'true';

import withPWAFn from '@ducanh2912/next-pwa';

const withPWA = withPWAFn({
  publicExcludes: ['!bulletins/**/*'],
  dest: 'public'
});

let config = {
  output: 'export',
  images: { unoptimized: true },
  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source'
    });
    return config;
  },
  typescript: {
    ignoreBuildErrors: env === 'production'
  }
};

if (enablePWA) {
  config = withPWA(config);
}

export default config;
