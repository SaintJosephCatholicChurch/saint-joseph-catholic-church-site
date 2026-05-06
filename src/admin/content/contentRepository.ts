import yaml from 'js-yaml';

import {
  expectArrayProperty,
  expectLiteral,
  expectNumberProperty,
  expectOptionalArrayProperty,
  expectOptionalStringArrayProperty,
  expectOptionalStringProperty,
  expectRecord,
  expectStringProperty
} from './validation';

import type {
  Bulletin,
  ChurchDetails,
  DailyReadings,
  FeaturedLink,
  FeaturedPage,
  HomePageData,
  LiveStreamButton,
  LogoDetails,
  MenuData,
  MenuItem,
  MenuLink,
  NewsletterDetails,
  ScheduleSection,
  SiteConfig,
  Slide,
  Staff,
  StylesConfig,
  Times,
  TimesDay,
  TimesNoteSection,
  TimesSection,
  TimesTime,
  TimesTimeNote
} from '../../interface';
import type { AdminRepoClient, RepoDirectoryEntry, RepoWriteResult } from '../services/adminTypes';

export const SITE_MEDIA_RULES = {
  bulletins: {
    folderPath: 'public/bulletins',
    publicPath: '/bulletins'
  },
  shared: {
    folderPath: 'public/files',
    publicPath: '/files'
  },
  staff: {
    folderPath: 'public/staff',
    publicPath: '/staff'
  }
} as const;

export const SITE_CONTENT_PATHS = {
  bulletins: 'content/bulletins',
  churchDetails: 'content/church_details.json',
  config: 'content/config.json',
  homepage: 'content/homepage.json',
  menu: 'content/menu.json',
  pages: 'content/pages',
  posts: 'content/posts',
  staff: 'content/staff.json',
  styles: 'content/styles.json',
  tags: 'content/meta/tags.json',
  times: 'content/times.json'
} as const;

export interface HomePageContentFile extends HomePageData {
  daily_readings_background?: string;
}

export interface StaffContentFile {
  staff: Staff[];
}

export interface StoredContentValue<T> {
  path: string;
  sha?: string;
  value: T;
}

export interface StoredDocument<TData extends object> {
  body: string;
  data: TData;
  path: string;
  sha?: string;
}

export interface TagContentFile {
  tags: string[];
}

export interface TimesContentFile {
  times: Times[];
}

export interface AdminPageFrontmatter {
  date: string;
  slug: string;
  title: string;
}

export interface AdminPostFrontmatter {
  date: string;
  image?: string;
  slug: string;
  tags?: string[];
  title: string;
}

const DOCUMENT_FILE_EXTENSION = '.mdx';
const JSON_FILE_EXTENSION = '.json';

function compareDateDescending(left: string, right: string) {
  return new Date(right).getTime() - new Date(left).getTime();
}

function fileNameFromPath(path: string) {
  return path.split('/').pop() || path;
}

function normalizeLineEndings(value: string) {
  return value.replace(/\r\n/g, '\n');
}

function parseJsonFile<T>(rawContent: string, path: string, validateValue: (value: unknown, label: string) => T): T {
  try {
    return validateValue(JSON.parse(rawContent) as unknown, path);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Invalid JSON.';
    throw new Error(`Failed to parse ${path}: ${reason}`);
  }
}

function parseFrontmatterFile<TData extends Record<string, unknown>>(
  rawContent: string,
  path: string,
  validateFrontmatter: (value: unknown, label: string, path: string) => TData
): StoredDocument<TData> {
  const normalizedContent = normalizeLineEndings(rawContent);

  if (!normalizedContent.startsWith('---\n')) {
    throw new Error(`${path} must start with YAML frontmatter.`);
  }

  const closingMarkerIndex = normalizedContent.indexOf('\n---\n', 4);
  if (closingMarkerIndex === -1) {
    throw new Error(`${path} is missing a closing YAML frontmatter delimiter.`);
  }

  const yamlSource = normalizedContent.slice(4, closingMarkerIndex);
  const body = normalizedContent.slice(closingMarkerIndex + 5);

  try {
    const frontmatter = yaml.load(yamlSource, { schema: yaml.JSON_SCHEMA });
    return {
      body,
      data: validateFrontmatter(frontmatter, `${path} frontmatter`, path),
      path
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Invalid YAML frontmatter.';
    throw new Error(`Failed to parse ${path}: ${reason}`);
  }
}

function pickOrderedKeys<TValue extends object>(value: TValue, orderedKeys: readonly (keyof TValue)[]) {
  const orderedValue = {} as TValue;
  const valueRecord = value as Record<string, unknown>;

  for (const key of orderedKeys) {
    if (value[key] !== undefined) {
      orderedValue[key] = value[key];
    }
  }

  for (const [key, propertyValue] of Object.entries(valueRecord)) {
    if (!(key in orderedValue) && propertyValue !== undefined) {
      orderedValue[key as keyof TValue] = propertyValue as TValue[keyof TValue];
    }
  }

  return orderedValue;
}

function serializeFrontmatterFile<TData extends object>(
  document: Pick<StoredDocument<TData>, 'body' | 'data'>,
  orderedKeys: readonly (keyof TData)[]
) {
  const yamlSource = yaml.dump(pickOrderedKeys(document.data, orderedKeys), {
    lineWidth: -1,
    noRefs: true,
    schema: yaml.JSON_SCHEMA,
    sortKeys: false
  });

  return `---\n${yamlSource}---\n${normalizeLineEndings(document.body)}`;
}

function toFileEntries(entries: RepoDirectoryEntry[], extension: string) {
  return entries
    .filter((entry) => entry.type === 'file' && entry.path.endsWith(extension))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function validateChurchDetails(value: unknown, label: string): ChurchDetails {
  const record = expectRecord(value, label);

  return {
    additional_emails: expectOptionalArrayProperty(record, 'additional_emails', label, (entry, index) => {
      const item = expectRecord(entry, `${label}.additional_emails[${index}]`);
      return {
        email: expectStringProperty(item, 'email', `${label}.additional_emails[${index}]`),
        name: expectStringProperty(item, 'name', `${label}.additional_emails[${index}]`)
      };
    }),
    additional_phones: expectOptionalArrayProperty(record, 'additional_phones', label, (entry, index) => {
      const item = expectRecord(entry, `${label}.additional_phones[${index}]`);
      return {
        name: expectStringProperty(item, 'name', `${label}.additional_phones[${index}]`),
        phone: expectStringProperty(item, 'phone', `${label}.additional_phones[${index}]`)
      };
    }),
    address: expectStringProperty(record, 'address', label),
    city: expectStringProperty(record, 'city', label),
    contacts: expectOptionalArrayProperty(record, 'contacts', label, (entry, index) => {
      const item = expectRecord(entry, `${label}.contacts[${index}]`);
      return {
        name: expectStringProperty(item, 'name', `${label}.contacts[${index}]`),
        title: expectStringProperty(item, 'title', `${label}.contacts[${index}]`)
      };
    }),
    email: expectStringProperty(record, 'email', label),
    facebook_page: expectStringProperty(record, 'facebook_page', label),
    google_map_location: expectStringProperty(record, 'google_map_location', label),
    mission_statement: expectStringProperty(record, 'mission_statement', label),
    name: expectStringProperty(record, 'name', label),
    online_giving_url: expectStringProperty(record, 'online_giving_url', label),
    phone: expectStringProperty(record, 'phone', label),
    state: expectStringProperty(record, 'state', label),
    vision_statement: expectStringProperty(record, 'vision_statement', label),
    zipcode: expectStringProperty(record, 'zipcode', label)
  };
}

function validateLiveStreamButton(value: unknown, label: string): LiveStreamButton {
  const record = expectRecord(value, label);
  return {
    title: expectStringProperty(record, 'title', label),
    url: expectStringProperty(record, 'url', label)
  };
}

function validateScheduleSection(value: unknown, label: string): ScheduleSection {
  const record = expectRecord(value, label);
  return {
    schedule_background: expectStringProperty(record, 'schedule_background', label),
    title: expectStringProperty(record, 'title', label)
  };
}

function validateDailyReadings(value: unknown, label: string): DailyReadings {
  const record = expectRecord(value, label);
  return {
    daily_readings_background: expectStringProperty(record, 'daily_readings_background', label),
    subtitle: expectStringProperty(record, 'subtitle', label),
    title: expectStringProperty(record, 'title', label)
  };
}

function validateNewsletter(value: unknown, label: string): NewsletterDetails {
  const record = expectRecord(value, label);
  return {
    bannerSubtitle: expectOptionalStringProperty(record, 'bannerSubtitle', label),
    bannerTitle: expectOptionalStringProperty(record, 'bannerTitle', label),
    rssFeedUrl: expectOptionalStringProperty(record, 'rssFeedUrl', label),
    signupButtonText: expectOptionalStringProperty(record, 'signupButtonText', label),
    signupLink: expectOptionalStringProperty(record, 'signupLink', label)
  };
}

function validateSlide(value: unknown, label: string): Slide {
  const record = expectRecord(value, label);
  return {
    image: expectStringProperty(record, 'image', label),
    title: expectOptionalStringProperty(record, 'title', label)
  };
}

function validateFeaturedItem(value: unknown, label: string): FeaturedLink | FeaturedPage {
  const record = expectRecord(value, label);
  const type = expectLiteral(record.type, `${label}.type`, ['featured_link', 'featured_page'] as const);

  if (type === 'featured_page') {
    return {
      image: expectOptionalStringProperty(record, 'image', label),
      page: expectStringProperty(record, 'page', label),
      summary: expectOptionalStringProperty(record, 'summary', label),
      type
    };
  }

  return {
    image: expectOptionalStringProperty(record, 'image', label),
    summary: expectOptionalStringProperty(record, 'summary', label),
    title: expectStringProperty(record, 'title', label),
    type,
    url: expectStringProperty(record, 'url', label)
  };
}

function validateHomepage(value: unknown, label: string): HomePageContentFile {
  const record = expectRecord(value, label);

  return {
    daily_readings: validateDailyReadings(record.daily_readings, `${label}.daily_readings`),
    daily_readings_background: expectOptionalStringProperty(record, 'daily_readings_background', label),
    featured: expectArrayProperty(record, 'featured', label, (entry, index) =>
      validateFeaturedItem(entry, `${label}.featured[${index}]`)
    ),
    invitation_text: expectStringProperty(record, 'invitation_text', label),
    live_stream_button: validateLiveStreamButton(record.live_stream_button, `${label}.live_stream_button`),
    newsletter: validateNewsletter(record.newsletter, `${label}.newsletter`),
    schedule_section: validateScheduleSection(record.schedule_section, `${label}.schedule_section`),
    slides: expectArrayProperty(record, 'slides', label, (entry, index) =>
      validateSlide(entry, `${label}.slides[${index}]`)
    )
  };
}

function validateBulletin(value: unknown, label: string): Bulletin {
  const record = expectRecord(value, label);
  return {
    date: expectOptionalStringProperty(record, 'date', label),
    name: expectOptionalStringProperty(record, 'name', label),
    pdf: expectOptionalStringProperty(record, 'pdf', label)
  };
}

function validateLogoDetails(value: unknown, label: string): LogoDetails {
  const record = expectRecord(value, label);
  return {
    primary: expectStringProperty(record, 'primary', label),
    secondary: expectStringProperty(record, 'secondary', label)
  };
}

function validateMenuLink(value: unknown, label: string): MenuLink {
  const record = expectRecord(value, label);
  return {
    page: expectOptionalStringProperty(record, 'page', label),
    title: expectStringProperty(record, 'title', label),
    url: expectOptionalStringProperty(record, 'url', label)
  };
}

function validateMenuItem(value: unknown, label: string): MenuItem {
  const link = validateMenuLink(value, label);
  const record = expectRecord(value, label);
  return {
    ...link,
    menu_links: expectOptionalArrayProperty(record, 'menu_links', label, (entry, index) =>
      validateMenuLink(entry, `${label}.menu_links[${index}]`)
    )
  };
}

function validateMenu(value: unknown, label: string): MenuData {
  const record = expectRecord(value, label);
  return {
    logo: validateLogoDetails(record.logo, `${label}.logo`),
    menu_items: expectArrayProperty(record, 'menu_items', label, (entry, index) =>
      validateMenuItem(entry, `${label}.menu_items[${index}]`)
    ),
    online_giving_button_text: expectStringProperty(record, 'online_giving_button_text', label)
  };
}

function validateSiteConfig(value: unknown, label: string): SiteConfig {
  const record = expectRecord(value, label);
  return {
    base_url: expectStringProperty(record, 'base_url', label),
    posts_per_page: expectNumberProperty(record, 'posts_per_page', label),
    privacy_policy_url: expectStringProperty(record, 'privacy_policy_url', label),
    site_description: expectStringProperty(record, 'site_description', label),
    site_image: expectStringProperty(record, 'site_image', label),
    site_keywords: expectOptionalStringArrayProperty(record, 'site_keywords', label) || [],
    site_title: expectStringProperty(record, 'site_title', label)
  };
}

function validateStaffEntry(value: unknown, label: string): Staff {
  const record = expectRecord(value, label);
  return {
    name: expectOptionalStringProperty(record, 'name', label),
    picture: expectOptionalStringProperty(record, 'picture', label),
    title: expectOptionalStringProperty(record, 'title', label)
  };
}

function validateStaffFile(value: unknown, label: string): StaffContentFile {
  const record = expectRecord(value, label);
  return {
    staff: expectArrayProperty(record, 'staff', label, (entry, index) =>
      validateStaffEntry(entry, `${label}.staff[${index}]`)
    )
  };
}

function validateStyles(value: unknown, label: string): StylesConfig {
  const record = expectRecord(value, label);
  return {
    footer_background: expectStringProperty(record, 'footer_background', label)
  };
}

function validateTagFile(value: unknown, label: string): TagContentFile {
  const record = expectRecord(value, label);
  return {
    tags: expectOptionalStringArrayProperty(record, 'tags', label) || []
  };
}

function validateTimesNote(value: unknown, label: string): TimesTimeNote {
  const record = expectRecord(value, label);
  return {
    id: expectOptionalStringProperty(record, 'id', label),
    note: expectOptionalStringProperty(record, 'note', label)
  };
}

function validateTimesTime(value: unknown, label: string): TimesTime {
  const record = expectRecord(value, label);
  return {
    end_time: expectOptionalStringProperty(record, 'end_time', label),
    id: expectOptionalStringProperty(record, 'id', label),
    notes: expectOptionalArrayProperty(record, 'notes', label, (entry, index) =>
      validateTimesNote(entry, `${label}.notes[${index}]`)
    ),
    time: expectOptionalStringProperty(record, 'time', label)
  };
}

function validateTimesDay(value: unknown, label: string): TimesDay {
  const record = expectRecord(value, label);
  return {
    day: expectStringProperty(record, 'day', label),
    id: expectOptionalStringProperty(record, 'id', label),
    times: expectOptionalArrayProperty(record, 'times', label, (entry, index) =>
      validateTimesTime(entry, `${label}.times[${index}]`)
    )
  };
}

function validateTimesSection(value: unknown, label: string): TimesSection | TimesNoteSection {
  const record = expectRecord(value, label);

  if ('note' in record) {
    return {
      id: expectOptionalStringProperty(record, 'id', label),
      note: expectStringProperty(record, 'note', label)
    };
  }

  return {
    days: expectOptionalArrayProperty(record, 'days', label, (entry, index) =>
      validateTimesDay(entry, `${label}.days[${index}]`)
    ),
    id: expectOptionalStringProperty(record, 'id', label),
    name: expectOptionalStringProperty(record, 'name', label) || ''
  };
}

function validateTimesValue(value: unknown, label: string): Times {
  const record = expectRecord(value, label);
  return {
    id: expectOptionalStringProperty(record, 'id', label),
    name: expectStringProperty(record, 'name', label),
    sections: expectOptionalArrayProperty(record, 'sections', label, (entry, index) =>
      validateTimesSection(entry, `${label}.sections[${index}]`)
    )
  };
}

function validateTimesFile(value: unknown, label: string): TimesContentFile {
  const record = expectRecord(value, label);
  return {
    times: expectArrayProperty(record, 'times', label, (entry, index) =>
      validateTimesValue(entry, `${label}.times[${index}]`)
    )
  };
}

function getSlugFromDocumentPath(path: string) {
  return fileNameFromPath(path).replace(/\.mdx$/i, '');
}

function validatePageFrontmatter(value: unknown, label: string, path: string): AdminPageFrontmatter {
  const record = expectRecord(value, label);
  return {
    date: expectStringProperty(record, 'date', label),
    slug: expectOptionalStringProperty(record, 'slug', label) || getSlugFromDocumentPath(path),
    title: expectStringProperty(record, 'title', label)
  };
}

function validatePostFrontmatter(value: unknown, label: string, path: string): AdminPostFrontmatter {
  const record = expectRecord(value, label);
  return {
    date: expectStringProperty(record, 'date', label),
    image: expectOptionalStringProperty(record, 'image', label),
    slug: expectOptionalStringProperty(record, 'slug', label) || getSlugFromDocumentPath(path),
    tags: expectOptionalStringArrayProperty(record, 'tags', label),
    title: expectStringProperty(record, 'title', label)
  };
}

class JsonFileAdapter<TValue> {
  readonly path: string;
  private readonly validateValue: (value: unknown, label: string) => TValue;

  constructor(path: string, validateValue: (value: unknown, label: string) => TValue) {
    this.path = path;
    this.validateValue = validateValue;
  }

  parse(rawContent: string, path = this.path) {
    return parseJsonFile(rawContent, path, this.validateValue);
  }

  async read(repoClient: AdminRepoClient): Promise<StoredContentValue<TValue>> {
    const file = await repoClient.readTextFile(this.path);
    return {
      path: file.path,
      sha: file.sha,
      value: this.parse(file.content, file.path)
    };
  }

  serialize(value: TValue) {
    return JSON.stringify(value, null, 2);
  }

  write(
    repoClient: AdminRepoClient,
    input: {
      message: string;
      sha?: string;
      value: TValue;
    }
  ): Promise<RepoWriteResult> {
    return repoClient.writeTextFile({
      content: this.serialize(input.value),
      message: input.message,
      path: this.path,
      sha: input.sha
    });
  }
}

class BulletinCollectionAdapter {
  readonly folderPath = SITE_CONTENT_PATHS.bulletins;

  buildPath(date: string) {
    return `${this.folderPath}/${date}${JSON_FILE_EXTENSION}`;
  }

  async list(repoClient: AdminRepoClient): Promise<StoredContentValue<Bulletin>[]> {
    const entries = toFileEntries(await repoClient.listFiles(this.folderPath), JSON_FILE_EXTENSION);
    const bulletins = await Promise.all(entries.map((entry) => this.read(repoClient, entry.path)));
    return bulletins.sort((left, right) => compareDateDescending(left.value.date || '', right.value.date || ''));
  }

  parse(rawContent: string, path: string) {
    return parseJsonFile(rawContent, path, validateBulletin);
  }

  async read(repoClient: AdminRepoClient, path: string): Promise<StoredContentValue<Bulletin>> {
    const file = await repoClient.readTextFile(path);
    return {
      path: file.path,
      sha: file.sha,
      value: this.parse(file.content, file.path)
    };
  }

  serialize(value: Bulletin) {
    return JSON.stringify(value, null, 2);
  }

  write(
    repoClient: AdminRepoClient,
    input: {
      message: string;
      path?: string;
      sha?: string;
      value: Bulletin;
    }
  ) {
    const path = input.path || this.buildPath(input.value.date || '');
    return repoClient.writeTextFile({
      content: this.serialize(input.value),
      message: input.message,
      path,
      sha: input.sha
    });
  }
}

class FrontmatterCollectionAdapter<TData extends { date: string; slug: string }> {
  readonly folderPath: string;
  private readonly orderedKeys: readonly (keyof TData)[];
  private readonly validateFrontmatter: (value: unknown, label: string, path: string) => TData;

  constructor(
    folderPath: string,
    orderedKeys: readonly (keyof TData)[],
    validateFrontmatter: (value: unknown, label: string, path: string) => TData
  ) {
    this.folderPath = folderPath;
    this.orderedKeys = orderedKeys;
    this.validateFrontmatter = validateFrontmatter;
  }

  buildPath(slug: string) {
    return `${this.folderPath}/${slug}${DOCUMENT_FILE_EXTENSION}`;
  }

  async list(repoClient: AdminRepoClient): Promise<StoredDocument<TData>[]> {
    const entries = toFileEntries(await repoClient.listFiles(this.folderPath), DOCUMENT_FILE_EXTENSION);
    const documents = await Promise.all(entries.map((entry) => this.read(repoClient, entry.path)));
    return documents.sort((left, right) => compareDateDescending(left.data.date, right.data.date));
  }

  parse(rawContent: string, path: string) {
    return parseFrontmatterFile(rawContent, path, this.validateFrontmatter);
  }

  async read(repoClient: AdminRepoClient, path: string): Promise<StoredDocument<TData>> {
    const file = await repoClient.readTextFile(path);
    const document = this.parse(file.content, file.path);
    return {
      ...document,
      sha: file.sha
    };
  }

  serialize(document: Pick<StoredDocument<TData>, 'body' | 'data'>) {
    return serializeFrontmatterFile(document, this.orderedKeys);
  }

  write(
    repoClient: AdminRepoClient,
    input: {
      body: string;
      data: TData;
      message: string;
      path?: string;
      sha?: string;
    }
  ) {
    const path = input.path || this.buildPath(String(input.data.slug));
    return repoClient.writeTextFile({
      content: this.serialize({ body: input.body, data: input.data }),
      message: input.message,
      path,
      sha: input.sha
    });
  }
}

export const siteContentAdapters = {
  bulletins: new BulletinCollectionAdapter(),
  churchDetails: new JsonFileAdapter(SITE_CONTENT_PATHS.churchDetails, validateChurchDetails),
  config: new JsonFileAdapter(SITE_CONTENT_PATHS.config, validateSiteConfig),
  homepage: new JsonFileAdapter(SITE_CONTENT_PATHS.homepage, validateHomepage),
  menu: new JsonFileAdapter(SITE_CONTENT_PATHS.menu, validateMenu),
  pages: new FrontmatterCollectionAdapter<AdminPageFrontmatter>(
    SITE_CONTENT_PATHS.pages,
    ['slug', 'title', 'date'] as const,
    validatePageFrontmatter
  ),
  posts: new FrontmatterCollectionAdapter<AdminPostFrontmatter>(
    SITE_CONTENT_PATHS.posts,
    ['slug', 'title', 'image', 'date', 'tags'] as const,
    validatePostFrontmatter
  ),
  staff: new JsonFileAdapter(SITE_CONTENT_PATHS.staff, validateStaffFile),
  styles: new JsonFileAdapter(SITE_CONTENT_PATHS.styles, validateStyles),
  tags: new JsonFileAdapter(SITE_CONTENT_PATHS.tags, validateTagFile),
  times: new JsonFileAdapter(SITE_CONTENT_PATHS.times, validateTimesFile)
};

export class ChurchSiteContentRepository {
  private readonly repoClient: AdminRepoClient;

  constructor(repoClient: AdminRepoClient) {
    this.repoClient = repoClient;
  }

  listBulletins() {
    return siteContentAdapters.bulletins.list(this.repoClient);
  }

  listPages() {
    return siteContentAdapters.pages.list(this.repoClient);
  }

  listPosts() {
    return siteContentAdapters.posts.list(this.repoClient);
  }

  readBulletin(path: string) {
    return siteContentAdapters.bulletins.read(this.repoClient, path);
  }

  readBulletinByDate(date: string) {
    return this.readBulletin(siteContentAdapters.bulletins.buildPath(date));
  }

  readChurchDetails() {
    return siteContentAdapters.churchDetails.read(this.repoClient);
  }

  readHomepage() {
    return siteContentAdapters.homepage.read(this.repoClient);
  }

  readMenu() {
    return siteContentAdapters.menu.read(this.repoClient);
  }

  readPage(path: string) {
    return siteContentAdapters.pages.read(this.repoClient, path);
  }

  readPageBySlug(slug: string) {
    return this.readPage(siteContentAdapters.pages.buildPath(slug));
  }

  readPost(path: string) {
    return siteContentAdapters.posts.read(this.repoClient, path);
  }

  readPostBySlug(slug: string) {
    return this.readPost(siteContentAdapters.posts.buildPath(slug));
  }

  readSiteConfig() {
    return siteContentAdapters.config.read(this.repoClient);
  }

  readStaff() {
    return siteContentAdapters.staff.read(this.repoClient);
  }

  readStyles() {
    return siteContentAdapters.styles.read(this.repoClient);
  }

  readTags() {
    return siteContentAdapters.tags.read(this.repoClient);
  }

  readTimes() {
    return siteContentAdapters.times.read(this.repoClient);
  }

  writeBulletin(input: { message: string; path?: string; sha?: string; value: Bulletin }) {
    return siteContentAdapters.bulletins.write(this.repoClient, input);
  }

  writeChurchDetails(input: { message: string; sha?: string; value: ChurchDetails }) {
    return siteContentAdapters.churchDetails.write(this.repoClient, input);
  }

  writeHomepage(input: { message: string; sha?: string; value: HomePageContentFile }) {
    return siteContentAdapters.homepage.write(this.repoClient, input);
  }

  writeMenu(input: { message: string; sha?: string; value: MenuData }) {
    return siteContentAdapters.menu.write(this.repoClient, input);
  }

  writePage(input: { body: string; data: AdminPageFrontmatter; message: string; path?: string; sha?: string }) {
    return siteContentAdapters.pages.write(this.repoClient, input);
  }

  writePost(input: { body: string; data: AdminPostFrontmatter; message: string; path?: string; sha?: string }) {
    return siteContentAdapters.posts.write(this.repoClient, input);
  }

  writeSiteConfig(input: { message: string; sha?: string; value: SiteConfig }) {
    return siteContentAdapters.config.write(this.repoClient, input);
  }

  writeStaff(input: { message: string; sha?: string; value: StaffContentFile }) {
    return siteContentAdapters.staff.write(this.repoClient, input);
  }

  writeStyles(input: { message: string; sha?: string; value: StylesConfig }) {
    return siteContentAdapters.styles.write(this.repoClient, input);
  }

  writeTags(input: { message: string; sha?: string; value: TagContentFile }) {
    return siteContentAdapters.tags.write(this.repoClient, input);
  }

  writeTimes(input: { message: string; sha?: string; value: TimesContentFile }) {
    return siteContentAdapters.times.write(this.repoClient, input);
  }
}
