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

export const ADMIN_HOMEPAGE_MASS_TIMES_ATTRIBUTE = 'data-admin-homepage-mass-times-target';

const ACTIVE_HOMEPAGE_PREVIEW_TARGET_STYLE = {
  backgroundColor: 'rgba(188, 47, 59, 0.1)',
  boxShadow: 'inset 0 0 0 1px rgba(127, 35, 44, 0.24)',
  borderRadius: '4px'
} as const;

export type HomepageHeroFieldName = keyof typeof HOMEPAGE_HERO_FIELD_KEYS;
export type HomepageSectionFieldName = keyof typeof HOMEPAGE_SECTION_FIELD_KEYS;
export type HomepageSlideFieldName = (typeof HOMEPAGE_SLIDE_FIELDS)[number];
export type HomepageFeaturedFieldName = (typeof HOMEPAGE_FEATURED_FIELDS)[number];
export type HomepageHeroFieldKey = (typeof HOMEPAGE_HERO_FIELD_KEYS)[HomepageHeroFieldName];
export type HomepageSectionFieldKey = (typeof HOMEPAGE_SECTION_FIELD_KEYS)[HomepageSectionFieldName];
export type HomepageSlideFieldKey = `slides|${number}|${HomepageSlideFieldName}`;
export type HomepageFeaturedFieldKey = `featured|${number}|${HomepageFeaturedFieldName}`;
export type HomepageFieldKey =
  | HomepageHeroFieldKey
  | HomepageSectionFieldKey
  | HomepageSlideFieldKey
  | HomepageFeaturedFieldKey;

type ParsedHomepageFieldKey =
  | { field: HomepageHeroFieldName; tab: 'hero' }
  | { field: HomepageSectionFieldName; tab: 'sections' }
  | { field: HomepageSlideFieldName; index: number; tab: 'slides' }
  | { field: HomepageFeaturedFieldName; index: number; tab: 'featured' };

export function createHomepageSlideFieldKey(index: number, field: HomepageSlideFieldName): HomepageSlideFieldKey {
  return `slides|${index}|${field}`;
}

export function createHomepageFeaturedFieldKey(
  index: number,
  field: HomepageFeaturedFieldName
): HomepageFeaturedFieldKey {
  return `featured|${index}|${field}`;
}

export function getActiveHomepagePreviewTargetStyle(fieldKey: string | undefined, activeFieldKey?: HomepageFieldKey) {
  return fieldKey && activeFieldKey === fieldKey ? ACTIVE_HOMEPAGE_PREVIEW_TARGET_STYLE : undefined;
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
    const index = Number.parseInt(rawIndexOrField, 10);

    if (Number.isNaN(index)) {
      return null;
    }

    return {
      field: rawField as HomepageSlideFieldName,
      index,
      tab: 'slides'
    };
  }

  if (
    prefix === 'featured' &&
    rawIndexOrField &&
    rawField &&
    HOMEPAGE_FEATURED_FIELDS.includes(rawField as HomepageFeaturedFieldName)
  ) {
    const index = Number.parseInt(rawIndexOrField, 10);

    if (Number.isNaN(index)) {
      return null;
    }

    return {
      field: rawField as HomepageFeaturedFieldName,
      index,
      tab: 'featured'
    };
  }

  return null;
}
