const withPWA = require('next-pwa')({
  dest: 'public'
});

module.exports = withPWA({
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
});
