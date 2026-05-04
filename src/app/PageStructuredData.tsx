import { formatISO } from 'date-fns';

import { buildAbsoluteImageUrl, buildAbsoluteUrl } from './routeMetadata';

interface PageStructuredDataProps {
  url: string;
  title: string;
  date: Date;
  keywords?: string[];
  image?: string;
  description?: string;
}

const PageStructuredData = ({ url, title, date, keywords, image, description }: PageStructuredDataProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: buildAbsoluteUrl(url),
    headline: title,
    keywords: keywords?.length ? keywords.join(',') : undefined,
    datePublished: formatISO(date),
    image: image ? buildAbsoluteImageUrl(image) : undefined,
    description
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
};

export default PageStructuredData;
