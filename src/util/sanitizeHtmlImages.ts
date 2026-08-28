// Utility to post-process HTML strings and make <img> tags safer/performant for rendering
// - strip script/event-handler XSS vectors from CMS HTML
// - ensure img tags have alt attribute (empty if missing)
// - add loading="lazy" where appropriate
// - add decoding="async"
// - ensure self-closing <img/> format
export default function sanitizeHtmlImages(html: string | undefined): string | TrustedHTML {
  if (!html) {
    return '';
  }

  const withoutDangerousMarkup = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src|xlink:href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '$1=$2$2');

  // Add alt="" if missing, add loading and decoding attributes, and normalize closing
  // This is a safe, conservative transformation and should not change existing alt text.
  return withoutDangerousMarkup
    .replace(/<img([^>]*?)>/gi, (match: string, attrs: string) => {
      let newAttrs: string = attrs || '';

      // If alt is not present, add empty alt
      if (!/\balt=/.test(newAttrs)) {
        newAttrs = `${newAttrs} alt=""`;
      }

      // If loading is not present, add lazy (it's safe for content images; authors can override)
      if (!/\bloading=/.test(newAttrs)) {
        newAttrs = `${newAttrs} loading="lazy"`;
      }

      // Add decoding async if not present
      if (!/\bdecoding=/.test(newAttrs)) {
        newAttrs = `${newAttrs} decoding="async"`;
      }

      // Collapse multiple spaces
      newAttrs = newAttrs.replace(/\s+/g, ' ').trim();

      // Ensure src attributes that are relative have a leading slash (CMS may produce asset paths)
      newAttrs = newAttrs.replace(/src="(?!https?:|\/)([^"]+)"/gi, 'src="/$1"');

      return `<img ${newAttrs} />`;
    })
    .replace(/<img([^>]*?)\/?>\s*<\/img>/gi, '<img$1 />');
}
