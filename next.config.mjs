/** @type {import('next').NextConfig} */
const env = process.env.NODE_ENV || 'development';

import withPWAFn from '@ducanh2912/next-pwa';
import removeImportsFn from 'next-remove-imports';

const withPWA = withPWAFn({
  publicExcludes: ['!bulletins/**/*'],
  dest: 'public'
});

const removeImports = removeImportsFn();

// next.config.js
/** @type {import('next').NextConfig} */
let config = {
  output: 'export',
  images: { unoptimized: true },
  webpack: (config) => {
    config.module.rules.push(
      ...[
        {
          test: /\.yml$/,
          use: 'yaml-loader'
        },
        {
          test: /\.svg$/,
          use: '@svgr/webpack'
        }
      ]
    );
    return config;
  },
  eslint: {
    ignoreDuringBuilds: env === 'production'
  },
  typescript: {
    ignoreBuildErrors: env === 'production'
  }
};

config = removeImports(config);

if (env === 'production') {
  config = withPWA(config);
}

export default config;
