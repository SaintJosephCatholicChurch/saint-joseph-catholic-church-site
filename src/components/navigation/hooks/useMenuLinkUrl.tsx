import { useMemo } from 'react';
import type { MenuLink } from '../../../interface';
import { isNotEmpty } from '../../../util/string.util';

export function getMenuLinkUrl(link: MenuLink) {
  if (isNotEmpty(link.url)) {
    return link.url;
  }

  if (isNotEmpty(link.page)) {
    return `/${link.page}`;
  }

  return '';
}

const useMenuLinkUrl = (link: MenuLink) => useMemo(() => getMenuLinkUrl(link), [link]);

export default useMenuLinkUrl;
