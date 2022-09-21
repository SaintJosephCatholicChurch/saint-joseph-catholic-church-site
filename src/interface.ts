import matter from 'gray-matter';

export type ScreenSize = 'large' | 'medium' | 'small' | 'mobile';

export interface FileMatter {
  readonly fileName: string;
  readonly fullPath: string;
  readonly matterResult: matter.GrayMatterFile<string>;
}

export interface FeaturedPage {
  image?: string;
  summary?: string;
  page?: string;
}

export interface HomePageData {
  slides: Slide[];
  schedule_background: string;
  daily_readings_background: string;
  featured_page: FeaturedPage;
}

export interface Slide {
  readonly image: string;
  readonly title: string;
}

export interface TimesTime {
  readonly time?: string;
  readonly end_time?: string;
  readonly note?: string;
}

export interface TimesDay {
  readonly day: string;
  readonly times?: TimesTime[];
}

export interface TimesSection {
  readonly name: string;
  readonly days?: TimesDay[];
}

export interface Times {
  readonly name: string;
  readonly sections?: TimesSection[];
}

export interface StylesConfig {
  readonly header_background: string;
  readonly header_color: string;
  readonly header_font_style: 'normal' | 'italic';
  readonly footer_background: string;
}

export interface ChurchDetails {
  readonly name: string;
  readonly mission_statement: string;
  readonly vision_statement: string;
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly phone: string;
  readonly additional_phones?: { name: string; phone: string }[];
  readonly email: string;
  readonly additional_emails?: { name: string; email: string }[];
  readonly contacts?: { title: string; name: string }[];
  readonly facebook_page: string;
  readonly google_map_location: string;
}

export interface Bulletin {
  readonly name?: string;
  readonly date?: string;
  readonly pdf?: string;
}

export interface BulletinPDFMeta {
  readonly pages: string[];
  readonly text: string;
}

export interface BulletinPDFData {
  readonly title: string;
  readonly slug: string;
  readonly date: string;
  readonly pages: string[];
  readonly text: string;
}

export interface Staff {
  readonly name?: string;
  readonly title?: string;
  readonly picture?: string;
}

export interface PostContentData {
  readonly date: string;
  readonly title: string;
  readonly image: string;
  readonly slug: string;
  readonly tags?: string[];
}

export interface PostContent {
  readonly fullPath: string;
  readonly summary: string;
  readonly content: string;
  readonly data: PostContentData;
}

export interface PageContentData {
  readonly date: string;
  readonly title: string;
  readonly image: string;
  readonly slug: string;
  readonly tags?: string[];
}

export interface PageContent {
  readonly fullPath: string;
  readonly content: string;
  readonly summary: string;
  readonly data: PageContentData;
}

export interface SiteConfig {
  readonly base_url: string;
  readonly site_title: string;
  readonly site_description: string;
  readonly site_image: string;
  readonly site_keywords: { keyword: string }[];
  readonly posts_per_page: number;
}

export interface MenuItem extends MenuLink {
  menu_links?: MenuLink[];
}

export interface MenuLink {
  readonly title: string;
  readonly url?: string;
  readonly page?: string;
}

export interface TagContent {
  readonly slug: string;
  readonly name: string;
}

export type ContentType = 'News' | 'Page' | 'Bulletin';
export const NEWS: ContentType = 'News';
export const PAGE: ContentType = 'Page';
export const BULLETIN: ContentType = 'Bulletin';

export interface SearchableEntry {
  readonly title: string;
  readonly subtitle?: string;
  readonly content: string;
  readonly summary?: string;
  readonly url: string;
  readonly type: ContentType;
  readonly priority?: boolean;
  readonly date?: string;
}
