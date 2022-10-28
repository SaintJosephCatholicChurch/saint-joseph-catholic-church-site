import { readdirSync } from 'fs';

(function () {
  const files = readdirSync('./content/posts');

  const redirects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');

    return {
      source: `/${slug}`,
      destination: `/news/${slug}`,
      permanent: true
    };
  });

  console.info(redirects);
})();
