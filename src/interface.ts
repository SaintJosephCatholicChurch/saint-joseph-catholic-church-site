import matter from 'gray-matter';

export type ScreenSize = 'large' | 'medium' | 'small' | 'mobile';

export interface FileMatter {
  readonly fileName: string;
  readonly fullPath: string;
  readonly matterResult: matter.GrayMatterFile<string>;
}

export interface HomePageData {
  slides: Slide[];
  schedule_background: string;
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
  readonly google_map_location: string;
}

export interface Bulletin {
  readonly name?: string;
  readonly date?: string;
  readonly pdf?: string;
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
  readonly site_keywords: { keyword: string }[];
  readonly posts_per_page: number;
  readonly twitter_account: string;
  readonly github_account: string;
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

export interface BulletinPDFMeta {
  readonly pages: string[];
}

export interface SearchableEntry {
  readonly title: string;
  readonly content: string;
  readonly summary: string;
  readonly url: string;
}
