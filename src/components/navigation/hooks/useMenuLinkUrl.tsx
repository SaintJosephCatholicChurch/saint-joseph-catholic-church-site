import { useMemo } from 'react';

import { isNotEmpty } from '../../../util/string.util';

import type { MenuLink } from '../../../interface';

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
