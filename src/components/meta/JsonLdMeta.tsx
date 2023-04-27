import formatISO from 'date-fns/formatISO';
import Script from 'next/script';
import { jsonLdScriptProps } from 'react-schemaorg';

import config from '../../lib/config';

import type { BlogPosting } from 'schema-dts';

interface JsonLdMetaProps {
  url: string;
  title: string;
  keywords?: string[];
  date: Date;
  image?: string;
  description?: string;
}

const JsonLdMeta = ({ url, title, keywords, date, image, description }: JsonLdMetaProps) => {
  return (
    <Script
      {...jsonLdScriptProps<BlogPosting>({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: config.base_url.replace(/\/$/g, '') + url,
        headline: title,
        keywords: keywords ? keywords.join(',') : undefined,
        datePublished: date ? formatISO(date) : undefined,
        image,
        description
      })}
    />
  );
};

export default JsonLdMeta;
