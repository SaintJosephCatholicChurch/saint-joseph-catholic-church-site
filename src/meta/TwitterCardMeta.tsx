import config from '../lib/config';

import type { Metadata } from 'next';

interface TwitterCardMetaProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export function generateTwitterCardMeta({ url, title, description, image }: TwitterCardMetaProps): Metadata {
  return {
    twitter: {
      card: 'summary_large_image',
      // TODO Fix
      // url: config.base_url.replace(/\/$/g, '') + url,
      title: title ? [title, config.site_title].join(' | ') : config.site_title,
      description: description ? description : config.site_description,
      images: image
        ? `${config.base_url.replace(/\/$/g, '')}/${image.replace(/^\//g, '')}`
        : `${config.base_url.replace(/\/$/g, '')}/${config.site_image.replace(/^\//g, '')}`
    }
  };
}
