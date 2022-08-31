import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type ScreenSize = 'large' | 'medium' | 'small' | 'mobile';

export interface FileMatter {
  readonly fileName: string;
  readonly fullPath: string;
  readonly matterResult: matter.GrayMatterFile<string>;
}

export interface HomePageData {
  slides: Slide[];
  schedule_background: string;
  schedule_background_fallback_color: string;
}

export interface Slide {
  readonly image: string;
  readonly title: string;
}

export interface SerializedSlide {
  readonly image: string;
  readonly titleSource: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>;
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
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly phone: string;
  readonly email: string;
  readonly mission_statement: string;
  readonly vision_statement: string;
}

export interface Bulletin {
  readonly name: string;
  readonly date: string;
  readonly pdf: string;
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

export interface SerializedPostContent extends Omit<PostContent, 'content' | 'summary'> {
  readonly source: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>;
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
  readonly data: PageContentData;
};

export interface SerializedPageContent extends Omit<PageContent, 'content'> {
  readonly source: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>;
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

export interface QuickLink {
  readonly title: string;
  readonly subtitle?: string;
  readonly url: string;
  readonly background: string;
};
