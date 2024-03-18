import type matter from 'gray-matter';

export type ScreenSize = 'large' | 'medium' | 'small' | 'mobile';

export interface FileMatter {
  readonly fileName: string;
  readonly fullPath: string;
  readonly matterResult: matter.GrayMatterFile<string>;
}

export interface FeaturedPage {
  type: 'featured_page';
  page: string;
  image?: string;
  summary?: string;
}

export interface FeaturedLink {
  type: 'featured_link';
  title: string;
  url: string;
  image?: string;
  summary?: string;
}

export interface LiveStreamButton {
  title: string;
  url: string;
}

export interface ScheduleSection {
  title: string;
  schedule_background: string;
}

export interface DailyReadings {
  title: string;
  subtitle: string;
  daily_readings_background: string;
}

export interface HomePageData {
  slides: Slide[];
  live_stream_button: LiveStreamButton;
  invitation_text: string;
  schedule_section: ScheduleSection;
  daily_readings: DailyReadings;
  featured: (FeaturedPage | FeaturedLink)[];
  newsletter: NewsletterDetails;
}

export interface Slide {
  readonly image: string;
  readonly title: string;
}

export interface TimesTime {
  readonly id: string | undefined;
  readonly time?: string;
  readonly end_time?: string;
  readonly note?: string;
}

export interface TimesDay {
  readonly id: string | undefined;
  readonly day: string;
  readonly times?: TimesTime[];
}

export interface TimesSection {
  readonly id: string | undefined;
  readonly name: string;
  readonly days?: TimesDay[];
}

export interface TimesNoteSection {
  readonly id: string | undefined;
  readonly note: string;
}

export interface Times {
  readonly id: string | undefined;
  readonly name: string;
  readonly sections?: (TimesSection | TimesNoteSection)[];
}

export interface StylesConfig {
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
  readonly livestream_provider: 'youtube' | 'facebook';
  readonly facebook_page: string;
  readonly youtube_channel: string;
  readonly google_map_location: string;
  readonly online_giving_url: string;
}

export interface NewsletterDetails {
  readonly bannerTitle?: string;
  readonly bannerSubtitle?: string;
  readonly signupLink?: string;
  readonly signupButtonText?: string;
  readonly rssFeedUrl?: string;
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
  readonly image?: string;
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
  readonly site_keywords: string[];
  readonly posts_per_page: number;
  readonly privacy_policy_url: string;
}

export interface MenuItem extends MenuLink {
  menu_links?: MenuLink[];
}

export interface MenuLink {
  readonly title: string;
  readonly url?: string;
  readonly page?: string;
}

export interface MenuData {
  logo: LogoDetails;
  online_giving_button_text: string;
  menu_items: MenuItem[];
}

export type ContentType = 'News' | 'Page' | 'Bulletin';

export interface SearchableEntry {
  readonly title: string;
  readonly subtitle?: string;
  readonly content: string;
  readonly summary?: string;
  readonly showSummary?: boolean;
  readonly url: string;
  readonly type: ContentType;
  readonly priority?: boolean;
  readonly date?: string;
}

export interface LogoDetails {
  readonly primary: string;
  readonly secondary: string;
}

export interface NewsPostData {
  title: string;
  summary: string;
  link: string;
  image: string;
  date: Date;
  target?: '_blank';
}

export interface FlockNote {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

export interface FlockNoteFeed {
  rss?: {
    script: string;
    channel: {
      title: string;
      link: string;
      description: string;
      item: FlockNote[];
    };
    _version: string;
  };
}
