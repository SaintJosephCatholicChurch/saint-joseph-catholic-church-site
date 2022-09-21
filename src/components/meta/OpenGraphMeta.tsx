import Head from 'next/head';
import config from '../../lib/config';

interface OpenGraphMetaProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

const OpenGraphMeta = ({ url, title, description, image }: OpenGraphMetaProps) => {
  return (
    <Head>
      <meta property="og:site_name" content={config.site_title} />
      <meta property="og:url" content={config.base_url.replace(/\/$/g, '') + url} />
      <meta property="og:title" content={title ? [title, config.site_title].join(' | ') : ''} />
      <meta property="og:description" content={description ? description : config.site_description} />
      <meta property="og:image" content={image ? image : `${config.base_url.replace(/\/$/g, '')}/og_image.png`} />
      <meta property="og:type" content="article" />
    </Head>
  );
};

export default OpenGraphMeta;
