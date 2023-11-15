/** @type {import('next').NextConfig} */
const env = process.env.NODE_ENV || 'development';

import withPWAFn from '@ducanh2912/next-pwa';
import removeImportsFn from 'next-remove-imports';

const withPWA = withPWAFn({
  publicExcludes: ['!bulletins/**/*'],
  dest: 'public'
});

const removeImports = removeImportsFn();

let config = removeImports({
  output: 'export',
  pageExtensions: ['tsx'],
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
});

if (env === 'production') {
  config = withPWA(config);
}

export default config;
