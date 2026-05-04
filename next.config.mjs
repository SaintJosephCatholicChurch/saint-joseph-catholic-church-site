/** @type {import('next').NextConfig} */
const env = process.env.NODE_ENV || 'development';

import withPWAFn from '@ducanh2912/next-pwa';

const withPWA = withPWAFn({
  publicExcludes: ['!bulletins/**/*'],
  dest: 'public'
});

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

if (env === 'production') {
  config = withPWA(config);
}

export default config;
