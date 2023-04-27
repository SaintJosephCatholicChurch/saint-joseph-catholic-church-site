/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/list'
]);

const withPWA = require('next-pwa')({
  publicExcludes: ['!bulletins/**/*'],
  dest: 'public'
});

const removeImports = require('next-remove-imports')();

let config = removeImports(
  withTM({
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
    }
  })
);

if (process.env.NODE_ENV === 'production') {
  config = withPWA(config);
}

module.exports = config;
