import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

interface MenuLink {
  title: string;
  url?: string;
  page?: string;
}

interface MenuItem extends MenuLink {
  menu_links?: MenuLink[];
}

interface MenuData {
  menu_items: MenuItem[];
}

export interface InternalMenuTarget {
  parentTitle?: string;
  route: string;
  title: string;
}

function getMenuLinkUrl(link: MenuLink) {
  if (link.url?.trim()) {
    return link.url;
  }

  if (link.page?.trim()) {
    return `/${link.page}`;
  }

  return '';
}

function getMenuData() {
  const menuPath = path.join(process.cwd(), 'content', 'menu.json');
  return JSON.parse(readFileSync(menuPath, 'utf8')) as MenuData;
}

export function loadInternalMenuTargets(): InternalMenuTarget[] {
  const menu = getMenuData();
  const targets: InternalMenuTarget[] = [];

  for (const item of menu.menu_items) {
    const itemUrl = getMenuLinkUrl(item);
    if (itemUrl && !itemUrl.startsWith('http')) {
      targets.push({
        route: itemUrl,
        title: item.title
      });
    }

    for (const link of item.menu_links ?? []) {
      const linkUrl = getMenuLinkUrl(link);
      if (!linkUrl || linkUrl.startsWith('http')) {
        continue;
      }

      targets.push({
        parentTitle: item.title,
        route: linkUrl,
        title: link.title
      });
    }
  }

  return targets;
}

export function getLatestBulletinRoute() {
  const bulletinDirectory = path.join(process.cwd(), 'content', 'bulletins');
  const latestFile = readdirSync(bulletinDirectory)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((left, right) => right.localeCompare(left))[0];

  const latestBulletin = JSON.parse(readFileSync(path.join(bulletinDirectory, latestFile), 'utf8')) as { date: string };

  return `/parish-bulletins/${latestBulletin.date.slice(0, 10)}`;
}

export function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function routeMatches(pathname: string, route: string) {
  const normalizedPathname = normalizePathname(pathname);
  const normalizedRoute = normalizePathname(route);

  if (normalizedRoute === '/parish-bulletins') {
    return /^\/parish-bulletins\/\d{4}-\d{2}-\d{2}$/.test(normalizedPathname);
  }

  return normalizedPathname === normalizedRoute;
}
