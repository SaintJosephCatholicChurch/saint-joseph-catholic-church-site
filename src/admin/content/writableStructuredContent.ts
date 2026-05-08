import {
  ChurchSiteContentRepository,
  SITE_CONTENT_PATHS,
  siteContentAdapters,
  type StoredContentValue,
  type TagContentFile
} from './contentRepository';
import { loadSharedContentResource, setSharedContentResource } from './sharedContentStore';

import type { ChurchDetails, MenuData, MenuItem, MenuLink, SiteConfig, StylesConfig } from '../../interface';
import type { AdminRepoClient } from '../services/adminTypes';

export const STRUCTURED_WRITABLE_SECTIONS = [
  {
    description: 'Primary parish identity, contact, and mission fields stored in content/church_details.json.',
    id: 'churchDetails',
    label: 'Church Details'
  },
  {
    description: 'SEO and site-wide metadata stored in content/config.json.',
    id: 'siteConfig',
    label: 'Site Config'
  },
  {
    description: 'Logo text and navigation tree stored in content/menu.json.',
    id: 'menu',
    label: 'Menu And Logo'
  },
  {
    description: 'Shared article tags stored in content/meta/tags.json.',
    id: 'tags',
    label: 'Tags'
  },
  {
    description: 'Small style settings stored in content/styles.json.',
    id: 'styles',
    label: 'Styles'
  }
] as const;

export type StructuredSectionId = (typeof STRUCTURED_WRITABLE_SECTIONS)[number]['id'];

export interface ChurchDetailsDraft {
  additionalEmails: string;
  additionalPhones: string;
  address: string;
  city: string;
  contacts: string;
  email: string;
  facebookPage: string;
  googleMapLocation: string;
  missionStatement: string;
  name: string;
  onlineGivingUrl: string;
  phone: string;
  state: string;
  visionStatement: string;
  zipcode: string;
}

export interface SiteConfigDraft {
  baseUrl: string;
  postsPerPage: string;
  privacyPolicyUrl: string;
  siteDescription: string;
  siteImage: string;
  siteKeywords: string;
  siteTitle: string;
}

export interface MenuLinkDraft {
  page: string;
  title: string;
  url: string;
}

export interface MenuItemDraft extends MenuLinkDraft {
  menuLinks: MenuLinkDraft[];
}

export interface MenuDraft {
  logoPrimary: string;
  logoSecondary: string;
  menuItems: MenuItemDraft[];
  onlineGivingButtonText: string;
}

export interface TagsDraft {
  tags: string;
}

export interface StylesDraft {
  footerBackground: string;
}

export interface StructuredDraft {
  churchDetails: ChurchDetailsDraft;
  menu: MenuDraft;
  siteConfig: SiteConfigDraft;
  styles: StylesDraft;
  tags: TagsDraft;
}

export interface StructuredContent {
  churchDetails: StoredContentValue<ChurchDetails>;
  loadedAt: string;
  menu: StoredContentValue<MenuData>;
  siteConfig: StoredContentValue<SiteConfig>;
  styles: StoredContentValue<StylesConfig>;
  tags: StoredContentValue<TagContentFile>;
}

const STRUCTURED_SECTION_CACHE_KEY_PREFIX = 'structured-content';

function getStructuredSectionCacheKey(sectionId: StructuredSectionId) {
  return `${STRUCTURED_SECTION_CACHE_KEY_PREFIX}:${sectionId}`;
}

function createEmptyStructuredContent(): StructuredContent {
  return {
    churchDetails: {
      path: SITE_CONTENT_PATHS.churchDetails,
      value: {
        additional_emails: [],
        additional_phones: [],
        address: '',
        city: '',
        contacts: [],
        email: '',
        facebook_page: '',
        google_map_location: '',
        mission_statement: '',
        name: '',
        online_giving_url: '',
        phone: '',
        state: '',
        vision_statement: '',
        zipcode: ''
      }
    },
    loadedAt: new Date().toISOString(),
    menu: {
      path: SITE_CONTENT_PATHS.menu,
      value: {
        logo: {
          primary: '',
          secondary: ''
        },
        menu_items: [],
        online_giving_button_text: ''
      }
    },
    siteConfig: {
      path: SITE_CONTENT_PATHS.config,
      value: {
        base_url: '',
        posts_per_page: 10,
        privacy_policy_url: '',
        site_description: '',
        site_image: '',
        site_keywords: [],
        site_title: ''
      }
    },
    styles: {
      path: SITE_CONTENT_PATHS.styles,
      value: {
        footer_background: ''
      }
    },
    tags: {
      path: SITE_CONTENT_PATHS.tags,
      value: {
        tags: []
      }
    }
  };
}

async function loadStructuredSection(repoClient: AdminRepoClient, sectionId: StructuredSectionId) {
  return loadSharedContentResource(repoClient, getStructuredSectionCacheKey(sectionId), async () => {
    const repository = new ChurchSiteContentRepository(repoClient);

    switch (sectionId) {
      case 'churchDetails':
        return repository.readChurchDetails();
      case 'siteConfig':
        return repository.readSiteConfig();
      case 'menu':
        return repository.readMenu();
      case 'tags':
        return repository.readTags();
      case 'styles':
        return repository.readStyles();
      default:
        throw new Error('Unsupported structured section.');
    }
  });
}

function splitNonEmptyLines(value: string) {
  return value
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
}

function serializeMappedLines<TValue>(items: TValue[] | undefined, mapLine: (item: TValue) => string) {
  return (items || []).map((item) => mapLine(item)).join('\n');
}

function parseLinePairs(value: string, label: string, leftLabel: string, rightLabel: string) {
  return splitNonEmptyLines(value).map((line, index) => {
    const separatorIndex = line.indexOf('|');

    if (separatorIndex === -1) {
      throw new Error(`${label} line ${index + 1} must use "${leftLabel} | ${rightLabel}" format.`);
    }

    const left = line.slice(0, separatorIndex).trim();
    const right = line.slice(separatorIndex + 1).trim();

    if (!left || !right) {
      throw new Error(
        `${label} line ${index + 1} must include both ${leftLabel.toLowerCase()} and ${rightLabel.toLowerCase()}.`
      );
    }

    return { left, right };
  });
}

function parseStringList(value: string) {
  return value
    .split(/\r?\n|,/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function trimOptionalValue(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function parsePositiveInteger(value: string, label: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(`${label} is required.`);
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`${label} must be a whole number greater than 0.`);
  }

  return parsedValue;
}

function getSectionLabel(sectionId: StructuredSectionId) {
  return STRUCTURED_WRITABLE_SECTIONS.find((section) => section.id === sectionId)?.label || sectionId;
}

function buildChurchDetailsValue(draft: ChurchDetailsDraft) {
  const contacts = parseLinePairs(draft.contacts, 'Church contacts', 'Name', 'Title').map((entry) => ({
    name: entry.left,
    title: entry.right
  }));
  const additionalEmails = parseLinePairs(draft.additionalEmails, 'Additional emails', 'Name', 'Email').map(
    (entry) => ({
      email: entry.right,
      name: entry.left
    })
  );
  const additionalPhones = parseLinePairs(draft.additionalPhones, 'Additional phones', 'Name', 'Phone').map(
    (entry) => ({
      name: entry.left,
      phone: entry.right
    })
  );

  return siteContentAdapters.churchDetails.parse(
    JSON.stringify({
      additional_emails: additionalEmails,
      additional_phones: additionalPhones,
      address: draft.address,
      city: draft.city,
      contacts,
      email: draft.email,
      facebook_page: draft.facebookPage,
      google_map_location: draft.googleMapLocation,
      mission_statement: draft.missionStatement,
      name: draft.name,
      online_giving_url: draft.onlineGivingUrl,
      phone: draft.phone,
      state: draft.state,
      vision_statement: draft.visionStatement,
      zipcode: draft.zipcode
    }),
    SITE_CONTENT_PATHS.churchDetails
  );
}

function buildSiteConfigValue(draft: SiteConfigDraft) {
  return siteContentAdapters.config.parse(
    JSON.stringify({
      base_url: draft.baseUrl,
      posts_per_page: parsePositiveInteger(draft.postsPerPage, 'Posts per page'),
      privacy_policy_url: draft.privacyPolicyUrl,
      site_description: draft.siteDescription,
      site_image: draft.siteImage,
      site_keywords: parseStringList(draft.siteKeywords),
      site_title: draft.siteTitle
    }),
    SITE_CONTENT_PATHS.config
  );
}

function createMenuLinkDraft(value: MenuLink): MenuLinkDraft {
  return {
    page: value.page || '',
    title: value.title,
    url: value.url || ''
  };
}

function createMenuItemDraft(value: MenuItem): MenuItemDraft {
  return {
    ...createMenuLinkDraft(value),
    menuLinks: (value.menu_links || []).map(createMenuLinkDraft)
  };
}

function buildMenuLinkValue(draft: MenuLinkDraft): MenuLink {
  return {
    page: trimOptionalValue(draft.page),
    title: draft.title.trim(),
    url: trimOptionalValue(draft.url)
  };
}

function buildMenuItemValue(draft: MenuItemDraft): MenuItem {
  const menuLinks = draft.menuLinks.map(buildMenuLinkValue);

  return {
    ...buildMenuLinkValue(draft),
    menu_links: menuLinks.length ? menuLinks : undefined
  };
}

function buildMenuValue(draft: MenuDraft) {
  return siteContentAdapters.menu.parse(
    JSON.stringify({
      logo: {
        primary: draft.logoPrimary,
        secondary: draft.logoSecondary
      },
      menu_items: draft.menuItems.map(buildMenuItemValue),
      online_giving_button_text: draft.onlineGivingButtonText
    }),
    SITE_CONTENT_PATHS.menu
  );
}

function buildTagsValue(draft: TagsDraft) {
  return siteContentAdapters.tags.parse(
    JSON.stringify({
      tags: parseStringList(draft.tags)
    }),
    SITE_CONTENT_PATHS.tags
  );
}

function buildStylesValue(draft: StylesDraft) {
  return siteContentAdapters.styles.parse(
    JSON.stringify({
      footer_background: draft.footerBackground
    }),
    SITE_CONTENT_PATHS.styles
  );
}

function buildCommitMessage(sectionId: StructuredSectionId) {
  return `Admin: update ${getSectionLabel(sectionId)}`;
}

export function createStructuredDraft(content: StructuredContent): StructuredDraft {
  return {
    churchDetails: {
      additionalEmails: serializeMappedLines(
        content.churchDetails.value.additional_emails,
        (entry) => `${entry.name} | ${entry.email}`
      ),
      additionalPhones: serializeMappedLines(
        content.churchDetails.value.additional_phones,
        (entry) => `${entry.name} | ${entry.phone}`
      ),
      address: content.churchDetails.value.address,
      city: content.churchDetails.value.city,
      contacts: serializeMappedLines(content.churchDetails.value.contacts, (entry) => `${entry.name} | ${entry.title}`),
      email: content.churchDetails.value.email,
      facebookPage: content.churchDetails.value.facebook_page,
      googleMapLocation: content.churchDetails.value.google_map_location,
      missionStatement: content.churchDetails.value.mission_statement,
      name: content.churchDetails.value.name,
      onlineGivingUrl: content.churchDetails.value.online_giving_url,
      phone: content.churchDetails.value.phone,
      state: content.churchDetails.value.state,
      visionStatement: content.churchDetails.value.vision_statement,
      zipcode: content.churchDetails.value.zipcode
    },
    menu: {
      logoPrimary: content.menu.value.logo.primary,
      logoSecondary: content.menu.value.logo.secondary,
      menuItems: content.menu.value.menu_items.map(createMenuItemDraft),
      onlineGivingButtonText: content.menu.value.online_giving_button_text
    },
    siteConfig: {
      baseUrl: content.siteConfig.value.base_url,
      postsPerPage: String(content.siteConfig.value.posts_per_page),
      privacyPolicyUrl: content.siteConfig.value.privacy_policy_url,
      siteDescription: content.siteConfig.value.site_description,
      siteImage: content.siteConfig.value.site_image,
      siteKeywords: content.siteConfig.value.site_keywords.join(', '),
      siteTitle: content.siteConfig.value.site_title
    },
    styles: {
      footerBackground: content.styles.value.footer_background
    },
    tags: {
      tags: content.tags.value.tags.join(', ')
    }
  };
}

export async function loadStructuredContent(
  repoClient: AdminRepoClient,
  sectionIds: StructuredSectionId[] = STRUCTURED_WRITABLE_SECTIONS.map((section) => section.id)
): Promise<StructuredContent> {
  const uniqueSectionIds = [...new Set(sectionIds)];
  const content = createEmptyStructuredContent();
  const loadedSections = await Promise.all(uniqueSectionIds.map((sectionId) => loadStructuredSection(repoClient, sectionId)));

  uniqueSectionIds.forEach((sectionId, index) => {
    switch (sectionId) {
      case 'churchDetails':
        content.churchDetails = loadedSections[index] as StructuredContent['churchDetails'];
        break;
      case 'siteConfig':
        content.siteConfig = loadedSections[index] as StructuredContent['siteConfig'];
        break;
      case 'menu':
        content.menu = loadedSections[index] as StructuredContent['menu'];
        break;
      case 'tags':
        content.tags = loadedSections[index] as StructuredContent['tags'];
        break;
      case 'styles':
        content.styles = loadedSections[index] as StructuredContent['styles'];
        break;
      default:
        break;
    }
  });

  content.loadedAt = new Date().toISOString();
  return content;
}

export async function saveStructuredSection(
  repoClient: AdminRepoClient,
  input: {
    content: StructuredContent;
    draft: StructuredDraft;
    sectionId: StructuredSectionId;
  }
): Promise<StructuredContent> {
  const repository = new ChurchSiteContentRepository(repoClient);
  let nextContent = input.content;

  switch (input.sectionId) {
    case 'churchDetails': {
      const result = await repository.writeChurchDetails({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.churchDetails.sha,
        value: buildChurchDetailsValue(input.draft.churchDetails)
      });
      nextContent = {
        ...input.content,
        churchDetails: {
          path: result.path,
          sha: result.sha,
          value: buildChurchDetailsValue(input.draft.churchDetails)
        }
      };
      break;
    }
    case 'siteConfig': {
      const result = await repository.writeSiteConfig({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.siteConfig.sha,
        value: buildSiteConfigValue(input.draft.siteConfig)
      });
      nextContent = {
        ...input.content,
        siteConfig: {
          path: result.path,
          sha: result.sha,
          value: buildSiteConfigValue(input.draft.siteConfig)
        }
      };
      break;
    }
    case 'menu': {
      const result = await repository.writeMenu({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.menu.sha,
        value: buildMenuValue(input.draft.menu)
      });
      nextContent = {
        ...input.content,
        menu: {
          path: result.path,
          sha: result.sha,
          value: buildMenuValue(input.draft.menu)
        }
      };
      break;
    }
    case 'tags': {
      const result = await repository.writeTags({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.tags.sha,
        value: buildTagsValue(input.draft.tags)
      });
      nextContent = {
        ...input.content,
        tags: {
          path: result.path,
          sha: result.sha,
          value: buildTagsValue(input.draft.tags)
        }
      };
      break;
    }
    case 'styles': {
      const result = await repository.writeStyles({
        message: buildCommitMessage(input.sectionId),
        sha: input.content.styles.sha,
        value: buildStylesValue(input.draft.styles)
      });
      nextContent = {
        ...input.content,
        styles: {
          path: result.path,
          sha: result.sha,
          value: buildStylesValue(input.draft.styles)
        }
      };
      break;
    }
    default: {
      throw new Error('Unsupported structured section.');
    }
  }

  setSharedContentResource(repoClient, getStructuredSectionCacheKey(input.sectionId), nextContent[input.sectionId]);

  return {
    ...nextContent,
    loadedAt: new Date().toISOString()
  };
}
