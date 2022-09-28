/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/list'
]);

const withPWA = require('next-pwa')({
  dest: 'public'
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const removeImports = require('next-remove-imports')();

const redirects = [
  { source: '/3763-2', destination: '/news/discussion-forum-the-saints', permanent: true },
  {
    source: '/40-days-for-life-novena',
    destination: '/news/40-days-for-life-novena',
    permanent: true
  },
  {
    source: '/advent-bible-study',
    destination: '/news/advent-bible-study',
    permanent: true
  },
  {
    source: '/advent-parish-mission',
    destination: '/news/advent-parish-mission',
    permanent: true
  },
  {
    source: '/advent-penance-service',
    destination: '/news/advent-penance-service',
    permanent: true
  },
  {
    source: '/all-saints-day-mass-times',
    destination: '/news/all-saints-day-mass-times',
    permanent: true
  },
  {
    source: '/all-saints-day-party',
    destination: '/news/all-saints-day-party',
    permanent: true
  },
  { source: '/alpha', destination: '/news/alpha', permanent: true },
  {
    source: '/animal-and-pet-blessing',
    destination: '/news/animal-and-pet-blessing',
    permanent: true
  },
  {
    source: '/ash-wednesday-mass-times',
    destination: '/news/ash-wednesday-mass-times',
    permanent: true
  },
  {
    source: '/ash-wednesday',
    destination: '/news/ash-wednesday',
    permanent: true
  },
  {
    source: '/assumption-of-the-blessed-virgin-mary',
    destination: '/news/assumption-of-the-blessed-virgin-mary',
    permanent: true
  },
  {
    source: '/bishop-rhoades-letter-on-st-joseph-catholic-cemetery',
    destination: '/news/bishop-rhoades-letter-on-st-joseph-catholic-cemetery',
    permanent: true
  },
  {
    source: '/bishop-rhoades-statement-on-dobbs',
    destination: '/news/bishop-rhoades-statement-on-dobbs',
    permanent: true
  },
  {
    source: '/christmas-mass-times-2',
    destination: '/news/christmas-mass-times-2',
    permanent: true
  },
  {
    source: '/christmas-mass-times-3',
    destination: '/news/christmas-mass-times-3',
    permanent: true
  },
  {
    source: '/christmas-mass-times',
    destination: '/news/christmas-mass-times',
    permanent: true
  },
  {
    source: '/discussion-forum-whats-new-in-rome',
    destination: '/news/discussion-forum-whats-new-in-rome',
    permanent: true
  },
  {
    source: '/feeding-tomorrows-future-today-2',
    destination: '/news/feeding-tomorrows-future-today-2',
    permanent: true
  },
  {
    source: '/first-friday-adoration-2',
    destination: '/news/first-friday-adoration-2',
    permanent: true
  },
  {
    source: '/first-friday-adoration',
    destination: '/news/first-friday-adoration',
    permanent: true
  },
  {
    source: '/holy-week-schedule-2',
    destination: '/news/holy-week-schedule-2',
    permanent: true
  },
  {
    source: '/holy-week-schedule',
    destination: '/news/holy-week-schedule',
    permanent: true
  },
  {
    source: '/january-book-study',
    destination: '/news/january-book-study',
    permanent: true
  },
  {
    source: '/july-daily-mass-schedule',
    destination: '/news/july-daily-mass-schedule',
    permanent: true
  },
  {
    source: '/june-daily-mass-schedule',
    destination: '/news/june-daily-mass-schedule',
    permanent: true
  },
  {
    source: '/knights-of-columbus-fish-fry',
    destination: '/news/knights-of-columbus-fish-fry',
    permanent: true
  },
  {
    source: '/knights-of-columbus-lenten-fish-fry',
    destination: '/news/knights-of-columbus-lenten-fish-fry',
    permanent: true
  },
  {
    source: '/kofc-fish-and-tenderloin-fry-drive-thru-only',
    destination: '/news/kofc-fish-and-tenderloin-fry-drive-thru-only',
    permanent: true
  },
  {
    source: '/live-stream-technical-difficulties',
    destination: '/news/live-stream-technical-difficulties',
    permanent: true
  },
  {
    source: '/mary-mother-of-god-mass-times-2',
    destination: '/news/mary-mother-of-god-mass-times-2',
    permanent: true
  },
  {
    source: '/mary-mother-of-god-mass-times',
    destination: '/news/mary-mother-of-god-mass-times',
    permanent: true
  },
  {
    source: '/new-pastor-installed',
    destination: '/news/new-pastor-installed',
    permanent: true
  },
  {
    source: '/parish-game-night',
    destination: '/news/parish-game-night',
    permanent: true
  },
  {
    source: '/parish-picnic',
    destination: '/news/parish-picnic',
    permanent: true
  },
  {
    source: '/parish-response-to-covid-19',
    destination: '/news/parish-response-to-covid-19',
    permanent: true
  },
  {
    source: '/public-masses-resume-may-23-24',
    destination: '/news/public-masses-resume-may-23-24',
    permanent: true
  },
  {
    source: '/red-cross-blood-drive-2',
    destination: '/news/red-cross-blood-drive-2',
    permanent: true
  },
  {
    source: '/red-cross-blood-drive-3',
    destination: '/news/red-cross-blood-drive-3',
    permanent: true
  },
  {
    source: '/red-cross-blood-drive-4',
    destination: '/news/red-cross-blood-drive-4',
    permanent: true
  },
  {
    source: '/red-cross-blood-drive-5',
    destination: '/news/red-cross-blood-drive-5',
    permanent: true
  },
  {
    source: '/red-cross-blood-drive',
    destination: '/news/red-cross-blood-drive',
    permanent: true
  },
  {
    source: '/religious-education-classes-resume-september-12th',
    destination: '/news/religious-education-classes-resume-september-12th',
    permanent: true
  },
  {
    source: '/solemnity-of-the-assumption-of-the-blessed-virgin-mary',
    destination: '/news/solemnity-of-the-assumption-of-the-blessed-virgin-mary',
    permanent: true
  },
  {
    source: '/solemnity-of-the-immaculate-conception',
    destination: '/news/solemnity-of-the-immaculate-conception',
    permanent: true
  },
  {
    source: '/st-francis-summer-reading-program',
    destination: '/news/st-francis-summer-reading-program',
    permanent: true
  },
  {
    source: '/st-josephs-day',
    destination: '/news/st-josephs-day',
    permanent: true
  },
  {
    source: '/teaching-mass-2',
    destination: '/news/teaching-mass-2',
    permanent: true
  },
  {
    source: '/teaching-mass',
    destination: '/news/teaching-mass',
    permanent: true
  },
  {
    source: '/thanksgiving-day-mass',
    destination: '/news/thanksgiving-day-mass',
    permanent: true
  },
  {
    source: '/upcoming-lenten-offerings',
    destination: '/news/upcoming-lenten-offerings',
    permanent: true
  },
  {
    source: '/update-covid-19-response-1-may-2020',
    destination: '/news/update-covid-19-response-1-may-2020',
    permanent: true
  },
  {
    source: '/update-parish-office-hours',
    destination: '/news/update-parish-office-hours',
    permanent: true
  },
  {
    source: '/updated-parish-response-to-covid-19',
    destination: '/news/updated-parish-response-to-covid-19',
    permanent: true
  },
  {
    source: '/welcome-fr-david',
    destination: '/news/welcome-fr-david',
    permanent: true
  },
  {
    source: '/young-adult-gathering',
    destination: '/news/young-adult-gathering',
    permanent: true
  },
  {
    source: '/young-adult-group',
    destination: '/news/young-adult-group',
    permanent: true
  }
];

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
    },
    redirects: async () => {
      return redirects;
    }
  })
);

if (process.env.NODE_ENV === 'production') {
  config = withPWA(config);
} else {
  config = withBundleAnalyzer(config);
}

module.exports = config;
