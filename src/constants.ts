import { ScreenSize } from './interface';

export const MAX_APP_WIDTH = 1200;

export const MAX_QUICK_LINK_WIDTH = 376;
export const MAX_QUICK_LINK_HEIGHT = 236;

export const CAROUSEL_MAX_HEIGHT = 640;

export const TIMES_PADDING_HEIGHT = (size: Omit<ScreenSize, 'mobile'>) => {
  if (size === 'small' || size == 'medium') {
    return 72;
  }
  return 100;
};
export const TIMES_TITLE_HEIGHT = (size: Omit<ScreenSize, 'mobile'>) => {
  if (size === 'small' || size == 'medium') {
    return 42;
  }
  return 52.5;
};
export const TIMES_LINE_MIN_HEIGHT = 33;
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

export const BLOG_IMAGE_DEFAULT_WIDTH = 640;
export const BLOG_IMAGE_DEFAULT_HEIGHT = 360;
