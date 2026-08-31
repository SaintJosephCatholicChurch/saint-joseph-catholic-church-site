const DANGEROUS_TAG_NAMES = 'script|iframe|object|embed|svg|math|form|style';
const VOID_DANGEROUS_TAG_NAMES = 'meta|base|link';
const DANGEROUS_URI_SCHEME = String.raw`(?:javascript|vbscript|data\s*:\s*text\s*\/\s*html)`;

export function stripDangerousUris(html: string) {
  return html
    .replace(
      new RegExp(
        String.raw`(href|src|xlink:href|action|formaction|srcdoc)\s*=\s*(['"])\s*${DANGEROUS_URI_SCHEME}[\s\S]*?\2`,
        'gi'
      ),
      '$1=$2$2'
    )
    .replace(
      new RegExp(String.raw`(href|src|xlink:href|action|formaction)\s*=\s*${DANGEROUS_URI_SCHEME}[^\s>]*`, 'gi'),
      '$1=""'
    );
}

function stripDangerousMarkup(html: string) {
  return stripDangerousUris(
    html
      .replace(new RegExp(String.raw`<(${DANGEROUS_TAG_NAMES})\b[^>]*>[\s\S]*?<\/\1>`, 'gi'), '')
      .replace(new RegExp(String.raw`<(?:${DANGEROUS_TAG_NAMES}|${VOID_DANGEROUS_TAG_NAMES})\b[^>]*\/?>`, 'gi'), '')
      .replace(/\bon[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  );
}

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

  const withoutDangerousMarkup = stripDangerousMarkup(html);

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
