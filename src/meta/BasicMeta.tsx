import config from '../lib/config';

import type { Metadata } from 'next';

interface BasicMetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url: string;
}

export function generateBasicMeta({ title, description, keywords, url }: BasicMetaProps): Metadata {
  return {
    title: title ? [title, config.site_title].join(' | ') : config.site_title,
    description: description ? description : config.site_description,
    keywords: keywords ? keywords.join(',') : config.site_keywords.join(','),
    metadataBase: new URL(config.base_url.replace(/\/$/g, '')),
    alternates: {
      canonical: url
    }
  };
}
