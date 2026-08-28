export const HOMEPAGE_HERO_FIELD_KEYS = {
  invitationText: 'hero|invitationText',
  liveStreamButtonTitle: 'hero|liveStreamButtonTitle',
  liveStreamButtonUrl: 'hero|liveStreamButtonUrl'
} as const;

export const HOMEPAGE_SECTION_FIELD_KEYS = {
  dailyReadingsBackground: 'sections|dailyReadingsBackground',
  dailyReadingsSubtitle: 'sections|dailyReadingsSubtitle',
  dailyReadingsTitle: 'sections|dailyReadingsTitle',
  newsletterBannerSubtitle: 'sections|newsletterBannerSubtitle',
  newsletterBannerTitle: 'sections|newsletterBannerTitle',
  newsletterRssFeedUrl: 'sections|newsletterRssFeedUrl',
  newsletterSignupButtonText: 'sections|newsletterSignupButtonText',
  newsletterSignupLink: 'sections|newsletterSignupLink',
  scheduleSectionBackground: 'sections|scheduleSectionBackground',
  scheduleSectionTitle: 'sections|scheduleSectionTitle'
} as const;

const HOMEPAGE_HERO_FIELDS = Object.keys(HOMEPAGE_HERO_FIELD_KEYS) as HomepageHeroFieldName[];
const HOMEPAGE_SECTION_FIELDS = Object.keys(HOMEPAGE_SECTION_FIELD_KEYS) as HomepageSectionFieldName[];
const HOMEPAGE_SLIDE_FIELDS = ['image', 'title'] as const;
const HOMEPAGE_FEATURED_FIELDS = ['image', 'pageSlug', 'pageTitle', 'summary', 'title', 'url'] as const;

export { ADMIN_HOMEPAGE_MASS_TIMES_ATTRIBUTE } from '../../../components/common/adminPreviewTarget';
export { getActiveAdminPreviewTargetStyle as getActiveHomepagePreviewTargetStyle } from '../../../components/common/adminPreviewTarget';

export type HomepageHeroFieldName = keyof typeof HOMEPAGE_HERO_FIELD_KEYS;
export type HomepageSectionFieldName = keyof typeof HOMEPAGE_SECTION_FIELD_KEYS;
export type HomepageSlideFieldName = (typeof HOMEPAGE_SLIDE_FIELDS)[number];
export type HomepageFeaturedFieldName = (typeof HOMEPAGE_FEATURED_FIELDS)[number];
export type HomepageHeroFieldKey = (typeof HOMEPAGE_HERO_FIELD_KEYS)[HomepageHeroFieldName];
export type HomepageSectionFieldKey = (typeof HOMEPAGE_SECTION_FIELD_KEYS)[HomepageSectionFieldName];
export type HomepageSlideFieldKey = `slides|${string}|${HomepageSlideFieldName}`;
export type HomepageFeaturedFieldKey = `featured|${string}|${HomepageFeaturedFieldName}`;
export type HomepageFieldKey =
  | HomepageHeroFieldKey
  | HomepageSectionFieldKey
  | HomepageSlideFieldKey
  | HomepageFeaturedFieldKey;

type ParsedHomepageFieldKey =
  | { field: HomepageHeroFieldName; tab: 'hero' }
  | { field: HomepageSectionFieldName; tab: 'sections' }
  | { clientId: string; field: HomepageSlideFieldName; tab: 'slides' }
  | { clientId: string; field: HomepageFeaturedFieldName; tab: 'featured' };

export function createHomepageSlideFieldKey(clientId: string, field: HomepageSlideFieldName): HomepageSlideFieldKey {
  return `slides|${clientId}|${field}`;
}

export function createHomepageFeaturedFieldKey(
  clientId: string,
  field: HomepageFeaturedFieldName
): HomepageFeaturedFieldKey {
  return `featured|${clientId}|${field}`;
}

export function parseHomepageFieldKey(fieldKey: string): ParsedHomepageFieldKey | null {
  const [prefix, rawIndexOrField, rawField] = fieldKey.split('|');

  if (prefix === 'hero' && rawIndexOrField && HOMEPAGE_HERO_FIELDS.includes(rawIndexOrField as HomepageHeroFieldName)) {
    return {
      field: rawIndexOrField as HomepageHeroFieldName,
      tab: 'hero'
    };
  }

  if (
    prefix === 'sections' &&
    rawIndexOrField &&
    HOMEPAGE_SECTION_FIELDS.includes(rawIndexOrField as HomepageSectionFieldName)
  ) {
    return {
      field: rawIndexOrField as HomepageSectionFieldName,
      tab: 'sections'
    };
  }

  if (
    prefix === 'slides' &&
    rawIndexOrField &&
    rawField &&
    HOMEPAGE_SLIDE_FIELDS.includes(rawField as HomepageSlideFieldName)
  ) {
    return {
      clientId: rawIndexOrField,
      field: rawField as HomepageSlideFieldName,
      tab: 'slides'
    };
  }

  if (
    prefix === 'featured' &&
    rawIndexOrField &&
    rawField &&
    HOMEPAGE_FEATURED_FIELDS.includes(rawField as HomepageFeaturedFieldName)
  ) {
    return {
      clientId: rawIndexOrField,
      field: rawField as HomepageFeaturedFieldName,
      tab: 'featured'
    };
  }

  return null;
}
