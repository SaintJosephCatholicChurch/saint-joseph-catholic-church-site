import formatISO from 'date-fns/formatISO';
import Head from 'next/head';
import { jsonLdScriptProps } from 'react-schemaorg';
import { BlogPosting } from 'schema-dts';
import config from '../../lib/config';

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
    <Head>
      <script
        {...jsonLdScriptProps<BlogPosting>({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          mainEntityOfPage: config.base_url.replace(/\/$/g, '') + url,
          headline: title,
          keywords: keywords ? keywords.join(',') : undefined,
          datePublished: date ? formatISO(date) : undefined,
          image: image,
          description: description
        })}
      />
    </Head>
  );
};

export default JsonLdMeta;
