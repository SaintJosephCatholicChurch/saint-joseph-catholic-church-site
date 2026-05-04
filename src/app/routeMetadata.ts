import config from '../lib/config';

import type { Metadata } from 'next';

interface BuildPageMetadataOptions {
  url: string;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
}

const baseUrl = config.base_url.replace(/\/$/g, '');

const normalizePath = (url: string) => {
  if (url === '/') {
    return '/';
  }

  return `/${url.replace(/^\/+|\/+$/g, '')}`;
};

export const buildAbsoluteUrl = (url: string) => `${baseUrl}${normalizePath(url)}`;

export const buildAbsoluteImageUrl = (image?: string) => {
  const normalizedImage = (image ?? config.site_image).replace(/^\//g, '');
  return `${baseUrl}/${normalizedImage}`;
};

export const buildPageMetadata = ({
  url,
  title,
  description,
  keywords,
  image,
  type = 'website'
}: BuildPageMetadataOptions): Metadata => {
  const resolvedTitle = title ? `${title} | ${config.site_title}` : config.site_title;
  const resolvedDescription = description ?? config.site_description;
  const resolvedUrl = buildAbsoluteUrl(url);
  const resolvedImageUrl = buildAbsoluteImageUrl(image);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: keywords ?? config.site_keywords,
    alternates: {
      canonical: resolvedUrl
    },
    openGraph: {
      siteName: config.site_title,
      url: resolvedUrl,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedImageUrl],
      type
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedImageUrl]
    }
  };
};
