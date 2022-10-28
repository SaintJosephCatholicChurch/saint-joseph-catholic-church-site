import type { ContentType, ScreenSize } from './interface';

export const MAX_APP_WIDTH = 1200;

export const CAROUSEL_DURATION = 5000;
export const CAROUSEL_MAX_HEIGHT_LG = 640;
export const CAROUSEL_MAX_HEIGHT_MD = 420;
export const CAROUSEL_MAX_HEIGHT_SM = 210;

export const TIMES_PADDING_HEIGHT = (size: Omit<ScreenSize, 'mobile'>) => {
  if (size === 'small' || size == 'medium') {
    return 72;
  }
  return 100;
};
export const TIMES_TITLE_HEIGHT = 42;
export const TIMES_LINE_MIN_HEIGHT = 34;
export const TIMES_LINE_TIMES_HEIGHT = (size: Omit<ScreenSize, 'mobile'>) => {
  if (size === 'small' || size == 'medium') {
    return 16;
  }
  return 17.25;
};
export const TIMES_LINE_TIMES_GAP = 4;
export const TIMES_LINE_PADDING_MARGIN_HEIGHT = 13;
export const TIMES_SECTION_TITLE_HEIGHT = 31;
export const TIMES_SECTION_MARGIN_HEIGHT = 32;

export const MENU_DELAY = 75;

export const RECENT_NEWS_TO_SHOW = 3;
export const UPCOMING_EVENTS_TO_SHOW = 4;

export const STAFF_DEFAULT_CARD_SIZE = 225;
export const STAFF_CARD_GAP_SIZE = 24;
export const STAFF_GLOBAL_PADDING = 48;

export const IMAGE_EXTENSION_REGEX = /(\.apng|\.avif|\.gif|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp|\.png|\.svg|\.webp)$/g;

export const EXTRA_EXTRA_SMALL_BREAKPOINT = 320;
export const EXTRA_SMALL_BREAKPOINT = 370;
export const SMALL_BREAKPOINT = 600;

export const SEARCH_RESULTS_TO_SHOW = 10;

export const SUMMARY_MIN_PARAGRAPH_LENGTH = 150;

export const NEWS: ContentType = 'News';
export const PAGE: ContentType = 'Page';
export const BULLETIN: ContentType = 'Bulletin';

export const REDIRECTS = {
  '/3763-2': '/news/discussion-forum-the-saints',
  '/40-days-for-life-novena': '/news/40-days-for-life-novena',
  '/advent-bible-study': '/news/advent-bible-study',
  '/advent-parish-mission': '/news/advent-parish-mission',
  '/advent-penance-service': '/news/advent-penance-service',
  '/all-saints-day-mass-times': '/news/all-saints-day-mass-times',
  '/all-saints-day-party': '/news/all-saints-day-party',
  '/alpha': '/news/alpha',
  '/animal-and-pet-blessing': '/news/animal-and-pet-blessing',
  '/ash-wednesday-mass-times': '/news/ash-wednesday-mass-times',
  '/ash-wednesday': '/news/ash-wednesday',
  '/assumption-of-the-blessed-virgin-mary': '/news/assumption-of-the-blessed-virgin-mary',
  '/bishop-rhoades-letter-on-st-joseph-catholic-cemetery': '/news/bishop-rhoades-letter-on-st-joseph-catholic-cemetery',
  '/bishop-rhoades-statement-on-dobbs': '/news/bishop-rhoades-statement-on-dobbs',
  '/christmas-mass-times-2': '/news/christmas-mass-times-2',
  '/christmas-mass-times-3': '/news/christmas-mass-times-3',
  '/christmas-mass-times': '/news/christmas-mass-times',
  '/discussion-forum-whats-new-in-rome': '/news/discussion-forum-whats-new-in-rome',
  '/feeding-tomorrows-future-today-2': '/news/feeding-tomorrows-future-today-2',
  '/first-friday-adoration-2': '/news/first-friday-adoration-2',
  '/first-friday-adoration': '/news/first-friday-adoration',
  '/holy-week-schedule-2': '/news/holy-week-schedule-2',
  '/holy-week-schedule': '/news/holy-week-schedule',
  '/january-book-study': '/news/january-book-study',
  '/july-daily-mass-schedule': '/news/july-daily-mass-schedule',
  '/june-daily-mass-schedule': '/news/june-daily-mass-schedule',
  '/knights-of-columbus-fish-fry': '/news/knights-of-columbus-fish-fry',
  '/knights-of-columbus-lenten-fish-fry': '/news/knights-of-columbus-lenten-fish-fry',
  '/kofc-fish-and-tenderloin-fry-drive-thru-only': '/news/kofc-fish-and-tenderloin-fry-drive-thru-only',
  '/live-stream-technical-difficulties': '/news/live-stream-technical-difficulties',
  '/mary-mother-of-god-mass-times-2': '/news/mary-mother-of-god-mass-times-2',
  '/mary-mother-of-god-mass-times': '/news/mary-mother-of-god-mass-times',
  '/new-pastor-installed': '/news/new-pastor-installed',
  '/parish-game-night': '/news/parish-game-night',
  '/parish-picnic': '/news/parish-picnic',
  '/parish-response-to-covid-19': '/news/parish-response-to-covid-19',
  '/public-masses-resume-may-23-24': '/news/public-masses-resume-may-23-24',
  '/red-cross-blood-drive-2': '/news/red-cross-blood-drive-2',
  '/red-cross-blood-drive-3': '/news/red-cross-blood-drive-3',
  '/red-cross-blood-drive-4': '/news/red-cross-blood-drive-4',
  '/red-cross-blood-drive-5': '/news/red-cross-blood-drive-5',
  '/red-cross-blood-drive': '/news/red-cross-blood-drive',
  '/religious-education-classes-resume-september-12th': '/news/religious-education-classes-resume-september-12th',
  '/solemnity-of-the-assumption-of-the-blessed-virgin-mary':
    '/news/solemnity-of-the-assumption-of-the-blessed-virgin-mary',
  '/solemnity-of-the-immaculate-conception': '/news/solemnity-of-the-immaculate-conception',
  '/st-francis-summer-reading-program': '/news/st-francis-summer-reading-program',
  '/st-josephs-day': '/news/st-josephs-day',
  '/teaching-mass-2': '/news/teaching-mass-2',
  '/teaching-mass': '/news/teaching-mass',
  '/thanksgiving-day-mass': '/news/thanksgiving-day-mass',
  '/upcoming-lenten-offerings': '/news/upcoming-lenten-offerings',
  '/update-covid-19-response-1-may-2020': '/news/update-covid-19-response-1-may-2020',
  '/update-parish-office-hours': '/news/update-parish-office-hours',
  '/updated-parish-response-to-covid-19': '/news/updated-parish-response-to-covid-19',
  '/welcome-fr-david': '/news/welcome-fr-david',
  '/young-adult-gathering': '/news/young-adult-gathering',
  '/young-adult-group': '/news/young-adult-group'
};
