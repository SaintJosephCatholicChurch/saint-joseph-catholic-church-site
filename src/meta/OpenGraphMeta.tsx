import config from '../lib/config';

import type { Metadata } from 'next';

interface OpenGraphMetaProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export function generateOpenGraphMeta({ url, title, description, image }: OpenGraphMetaProps): Metadata {
  return {
    openGraph: {
      siteName: config.site_title,
      url: config.base_url.replace(/\/$/g, '') + url,
      title: title ? [title, config.site_title].join(' | ') : '',
      description: description ? description : config.site_description,
      images: image
        ? `${config.base_url.replace(/\/$/g, '')}/${image.replace(/^\//g, '')}`
        : `${config.base_url.replace(/\/$/g, '')}/${config.site_image.replace(/^\//g, '')}`,
      type: 'article'
    }
  };
}
