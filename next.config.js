/** @type {import('next').NextConfig} */
const env = process.env.NODE_ENV || 'development';

const withPWA = require('next-pwa')({
  publicExcludes: ['!bulletins/**/*'],
  dest: 'public'
});

const removeImports = require('next-remove-imports')();

let config = removeImports({
  pageExtensions: ['tsx'],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
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
  transpilePackages: [
    '@fullcalendar/common',
    '@fullcalendar/daygrid',
    '@fullcalendar/react',
    '@fullcalendar/timegrid',
    '@fullcalendar/list'
  ],
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

module.exports = config;
