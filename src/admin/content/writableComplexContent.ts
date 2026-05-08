import {
  ChurchSiteContentRepository,
  SITE_CONTENT_PATHS,
  siteContentAdapters,
  type HomePageContentFile,
  type StaffContentFile,
  type StoredContentValue,
  type TimesContentFile
} from './contentRepository';
import { loadSharedContentResource, setSharedContentResource } from './sharedContentStore';

import type { FeaturedLink, FeaturedPage, HomePageData, Times } from '../../interface';
import type { AdminRepoClient } from '../services/adminTypes';

export const COMPLEX_WRITABLE_SECTIONS = [
  {
    description: 'Homepage slides, featured cards, and callouts stored in content/homepage.json.',
    id: 'homepage',
    label: 'Homepage'
  },
  {
    description: 'Schedule categories and time lines stored in content/times.json.',
    id: 'times',
    label: 'Times'
  },
  {
    description: 'Parish staff entries stored in content/staff.json.',
    id: 'staff',
    label: 'Staff'
  }
] as const;

export type ComplexSectionId = (typeof COMPLEX_WRITABLE_SECTIONS)[number]['id'];

export interface HomepageSlideDraft {
  image: string;
  title: string;
}

export interface HomepageFeaturedLinkDraft {
  image: string;
  summary: string;
  title: string;
  type: 'featured_link';
  url: string;
}

export interface HomepageFeaturedPageDraft {
  image: string;
  pageSlug: string;
  pageTitle: string;
  summary: string;
  type: 'featured_page';
}

export type HomepageFeaturedDraft = HomepageFeaturedLinkDraft | HomepageFeaturedPageDraft;

export interface HomepageDraft {
  dailyReadingsBackground: string;
  dailyReadingsSubtitle: string;
  dailyReadingsTitle: string;
  featured: HomepageFeaturedDraft[];
  invitationText: string;
  liveStreamButtonTitle: string;
  liveStreamButtonUrl: string;
  newsletterBannerSubtitle: string;
  newsletterBannerTitle: string;
  newsletterRssFeedUrl: string;
  newsletterSignupButtonText: string;
  newsletterSignupLink: string;
  scheduleSectionBackground: string;
  scheduleSectionTitle: string;
  slides: HomepageSlideDraft[];
}

export interface StaffEntryDraft {
  name: string;
  picture: string;
  title: string;
}

export interface ComplexDraft {
  homepage: HomepageDraft;
  staff: StaffEntryDraft[];
  times: Times[];
}

export interface ComplexContent {
  homepage: StoredContentValue<HomePageContentFile>;
  loadedAt: string;
  staff: StoredContentValue<StaffContentFile>;
  times: StoredContentValue<TimesContentFile>;
}

const COMPLEX_SECTION_CACHE_KEY_PREFIX = 'complex-content';

function getComplexSectionCacheKey(sectionId: ComplexSectionId) {
  return `${COMPLEX_SECTION_CACHE_KEY_PREFIX}:${sectionId}`;
}

function createEmptyComplexContent(): ComplexContent {
  return {
    homepage: {
      path: SITE_CONTENT_PATHS.homepage,
      value: {
        daily_readings: {
          daily_readings_background: '',
          subtitle: '',
          title: ''
        },
        daily_readings_background: '',
        featured: [],
        invitation_text: '',
        live_stream_button: {
          title: '',
          url: ''
        },
        newsletter: {
          bannerSubtitle: '',
          bannerTitle: '',
          rssFeedUrl: '',
          signupButtonText: '',
          signupLink: ''
        },
        schedule_section: {
          schedule_background: '',
          title: ''
        },
        slides: []
      }
    },
    loadedAt: new Date().toISOString(),
    staff: {
      path: SITE_CONTENT_PATHS.staff,
      value: {
        staff: []
      }
    },
    times: {
      path: SITE_CONTENT_PATHS.times,
      value: {
        times: []
      }
    }
  };
}

async function loadComplexSection(repoClient: AdminRepoClient, sectionId: ComplexSectionId) {
  return loadSharedContentResource(repoClient, getComplexSectionCacheKey(sectionId), async () => {
    const repository = new ChurchSiteContentRepository(repoClient);

    switch (sectionId) {
      case 'homepage':
        return repository.readHomepage();
      case 'times':
        return repository.readTimes();
      case 'staff':
        return repository.readStaff();
      default:
        throw new Error('Unsupported complex section.');
    }
  });
}

function cloneValue<TValue>(value: TValue): TValue {
  return JSON.parse(JSON.stringify(value)) as TValue;
}

function trimOptionalValue(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function parseFeaturedPageReference(value: string) {
  const [pageSlug, ...titleParts] = value.split('|');

  return {
    pageSlug: pageSlug?.trim() || '',
    pageTitle: titleParts.join('|').trim()
  };
}

function buildFeaturedPageReference(draft: HomepageFeaturedPageDraft) {
  const pageSlug = draft.pageSlug.trim();
  if (!pageSlug) {
    throw new Error('Featured page items require a page slug.');
  }

  const pageTitle = draft.pageTitle.trim();
  return pageTitle ? `${pageSlug}|${pageTitle}` : pageSlug;
}

function createFeaturedDraft(value: FeaturedLink | FeaturedPage): HomepageFeaturedDraft {
  if (value.type === 'featured_page') {
    const pageReference = parseFeaturedPageReference(value.page);

    return {
      image: value.image || '',
      pageSlug: pageReference.pageSlug,
      pageTitle: pageReference.pageTitle,
      summary: value.summary || '',
      type: 'featured_page'
    };
  }

  return {
    image: value.image || '',
    summary: value.summary || '',
    title: value.title,
    type: 'featured_link',
    url: value.url
  };
}

function buildFeaturedValue(value: HomepageFeaturedDraft) {
  if (value.type === 'featured_page') {
    return {
      image: trimOptionalValue(value.image),
      page: buildFeaturedPageReference(value),
      summary: trimOptionalValue(value.summary),
      type: value.type
    };
  }

  if (!value.title.trim()) {
    throw new Error('Featured link items require a title.');
  }

  if (!value.url.trim()) {
    throw new Error('Featured link items require a URL.');
  }

  return {
    image: trimOptionalValue(value.image),
    summary: trimOptionalValue(value.summary),
    title: value.title.trim(),
    type: value.type,
    url: value.url.trim()
  };
}

function buildHomepageValue(draft: HomepageDraft) {
  return siteContentAdapters.homepage.parse(
    JSON.stringify({
      daily_readings: {
        daily_readings_background: draft.dailyReadingsBackground.trim(),
        subtitle: draft.dailyReadingsSubtitle.trim(),
        title: draft.dailyReadingsTitle.trim()
      },
      daily_readings_background: draft.dailyReadingsBackground.trim(),
      featured: draft.featured.map((entry) => buildFeaturedValue(entry)),
      invitation_text: draft.invitationText.trim(),
      live_stream_button: {
        title: draft.liveStreamButtonTitle.trim(),
        url: draft.liveStreamButtonUrl.trim()
      },
      newsletter: {
        bannerSubtitle: draft.newsletterBannerSubtitle.trim(),
        bannerTitle: draft.newsletterBannerTitle.trim(),
        rssFeedUrl: draft.newsletterRssFeedUrl.trim(),
        signupButtonText: draft.newsletterSignupButtonText.trim(),
        signupLink: draft.newsletterSignupLink.trim()
      },
      schedule_section: {
        schedule_background: draft.scheduleSectionBackground.trim(),
        title: draft.scheduleSectionTitle.trim()
      },
      slides: draft.slides.map((slide, index) => {
        const image = slide.image.trim();

        if (!image) {
          throw new Error(`Homepage slide ${index + 1} requires an image path.`);
        }

        return {
          image,
          title: trimOptionalValue(slide.title)
        };
      })
    }),
    SITE_CONTENT_PATHS.homepage
  );
}

export function buildHomepagePreviewData(draft: HomepageDraft): HomePageData {
  return buildHomepageValue(draft);
}

function buildStaffValue(draft: StaffEntryDraft[]) {
  return siteContentAdapters.staff.parse(
    JSON.stringify({
      staff: draft.map((entry) => ({
        name: trimOptionalValue(entry.name),
        picture: trimOptionalValue(entry.picture),
        title: trimOptionalValue(entry.title)
      }))
    }),
    SITE_CONTENT_PATHS.staff
  );
}

function buildTimesValue(draft: Times[]) {
  return siteContentAdapters.times.parse(
    JSON.stringify({
      times: draft
    }),
    SITE_CONTENT_PATHS.times
  );
}

function getSectionLabel(sectionId: ComplexSectionId) {
  return COMPLEX_WRITABLE_SECTIONS.find((section) => section.id === sectionId)?.label || sectionId;
}

function buildCommitMessage(sectionId: ComplexSectionId) {
  return `Admin: update ${getSectionLabel(sectionId)}`;
}

export function createComplexDraft(content: ComplexContent): ComplexDraft {
  return {
    homepage: {
      dailyReadingsBackground:
        content.homepage.value.daily_readings.daily_readings_background ||
        content.homepage.value.daily_readings_background ||
        '',
      dailyReadingsSubtitle: content.homepage.value.daily_readings.subtitle,
      dailyReadingsTitle: content.homepage.value.daily_readings.title,
      featured: content.homepage.value.featured.map((entry) => createFeaturedDraft(entry)),
      invitationText: content.homepage.value.invitation_text,
      liveStreamButtonTitle: content.homepage.value.live_stream_button.title,
      liveStreamButtonUrl: content.homepage.value.live_stream_button.url,
      newsletterBannerSubtitle: content.homepage.value.newsletter.bannerSubtitle || '',
      newsletterBannerTitle: content.homepage.value.newsletter.bannerTitle || '',
      newsletterRssFeedUrl: content.homepage.value.newsletter.rssFeedUrl || '',
      newsletterSignupButtonText: content.homepage.value.newsletter.signupButtonText || '',
      newsletterSignupLink: content.homepage.value.newsletter.signupLink || '',
      scheduleSectionBackground: content.homepage.value.schedule_section.schedule_background,
      scheduleSectionTitle: content.homepage.value.schedule_section.title,
      slides: content.homepage.value.slides.map((slide) => ({
        image: slide.image || '',
        title: slide.title || ''
      }))
    },
    staff: content.staff.value.staff.map((entry) => ({
      name: entry.name || '',
      picture: entry.picture || '',
      title: entry.title || ''
    })),
    times: cloneValue(content.times.value.times)
  };
}

export async function loadComplexContent(
  repoClient: AdminRepoClient,
  sectionIds: ComplexSectionId[] = COMPLEX_WRITABLE_SECTIONS.map((section) => section.id)
): Promise<ComplexContent> {
  const uniqueSectionIds = [...new Set(sectionIds)];
  const content = createEmptyComplexContent();
  const loadedSections = await Promise.all(uniqueSectionIds.map((sectionId) => loadComplexSection(repoClient, sectionId)));

  uniqueSectionIds.forEach((sectionId, index) => {
    switch (sectionId) {
      case 'homepage':
        content.homepage = loadedSections[index] as ComplexContent['homepage'];
        break;
      case 'times':
        content.times = loadedSections[index] as ComplexContent['times'];
        break;
      case 'staff':
        content.staff = loadedSections[index] as ComplexContent['staff'];
        break;
      default:
        break;
    }
  });

  content.loadedAt = new Date().toISOString();
  return content;
}

export async function saveComplexSection(
  repoClient: AdminRepoClient,
  input: {
    content: ComplexContent;
    draft: ComplexDraft;
    sectionId: ComplexSectionId;
  }
): Promise<ComplexContent> {
  const repository = new ChurchSiteContentRepository(repoClient);
  let nextContent = input.content;

  switch (input.sectionId) {
    case 'homepage': {
      const result = await repository.writeHomepage({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.homepage.sha,
        value: buildHomepageValue(input.draft.homepage)
      });
      nextContent = {
        ...input.content,
        homepage: {
          path: result.path,
          sha: result.sha,
          value: buildHomepageValue(input.draft.homepage)
        }
      };
      break;
    }
    case 'times': {
      const result = await repository.writeTimes({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.times.sha,
        value: buildTimesValue(input.draft.times)
      });
      nextContent = {
        ...input.content,
        times: {
          path: result.path,
          sha: result.sha,
          value: buildTimesValue(input.draft.times)
        }
      };
      break;
    }
    case 'staff': {
      const result = await repository.writeStaff({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.staff.sha,
        value: buildStaffValue(input.draft.staff)
      });
      nextContent = {
        ...input.content,
        staff: {
          path: result.path,
          sha: result.sha,
          value: buildStaffValue(input.draft.staff)
        }
      };
      break;
    }
    default: {
      throw new Error('Unsupported complex section.');
    }
  }

  setSharedContentResource(repoClient, getComplexSectionCacheKey(input.sectionId), nextContent[input.sectionId]);

  return {
    ...nextContent,
    loadedAt: new Date().toISOString()
  };
}
