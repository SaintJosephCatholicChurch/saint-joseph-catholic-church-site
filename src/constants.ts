import type { ScreenSize } from './interface';

export const MAX_APP_WIDTH = 1200;

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

export const RECENT_NEWS_TO_SHOW = 4;
export const UPCOMING_EVENTS_TO_SHOW = 4;

export const STAFF_DEFAULT_CARD_SIZE = 225;
export const STAFF_CARD_GAP_SIZE = 24;
export const STAFF_GLOBAL_PADDING = 48;

export const IMAGE_EXTENSION_REGEX = /(\.apng|\.avif|\.gif|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp|\.png|\.svg|\.webp)$/g;

export const EXTRA_EXTRA_SMALL_BREAKPOINT = 320;
export const EXTRA_SMALL_BREAKPOINT = 370;
