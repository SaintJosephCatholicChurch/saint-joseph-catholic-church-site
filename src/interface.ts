import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

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
