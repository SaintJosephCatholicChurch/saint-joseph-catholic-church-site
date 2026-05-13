'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAdminFieldSelection } from '../components/adminPreviewSelection';

import type { MenuDraft, MenuItemDraft, MenuLinkDraft } from '../../content/writableStructuredContent';

export type MenuRootField = 'logoPrimary' | 'logoSecondary' | 'onlineGivingButtonText';
export type MenuItemField = 'page' | 'title' | 'url';

export type MenuFieldPath =
  | { kind: 'root' }
  | { field: MenuRootField; kind: 'root-field' }
  | { field: MenuItemField; itemIndex: number; kind: 'menu-item' }
  | { field: MenuItemField; itemIndex: number; kind: 'menu-link'; linkIndex: number };

export interface MenuBreadcrumb {
  label: string;
  path: MenuFieldPath;
}

export interface MenuEditorController {
  activePath: MenuFieldPath;
  activePathKey: string;
  addMenuItem: () => void;
  addMenuLink: (itemIndex: number) => void;
  breadcrumbs: MenuBreadcrumb[];
  menu: MenuDraft;
  moveMenuItems: (itemIndex: number, nextIndex: number) => void;
  moveMenuLinks: (itemIndex: number, linkIndex: number, nextIndex: number) => void;
  registerField: (path: Exclude<MenuFieldPath, { kind: 'root' }>) => (element: HTMLElement | null) => void;
  removeMenuItem: (itemIndex: number) => void;
  removeMenuLink: (itemIndex: number, linkIndex: number) => void;
  selectPathKey: (pathKey: string) => void;
  selection: {
    item: MenuItemDraft | undefined;
    itemIndex: number;
    link: MenuLinkDraft | undefined;
    linkIndex: number;
  };
  setActivePath: (path: MenuFieldPath, options?: SelectMenuFieldOptions) => void;
  updateMenuItemField: (itemIndex: number, field: MenuItemField, value: string) => void;
  updateMenuLinkField: (itemIndex: number, linkIndex: number, field: MenuItemField, value: string) => void;
  updateRootField: (field: MenuRootField, value: string) => void;
}

interface MenuEditorControllerOptions {
  menu: MenuDraft;
  onChange: (value: MenuDraft) => void;
}

interface SelectMenuFieldOptions {
  focus?: boolean;
}

function createEmptyMenuLink(): MenuLinkDraft {
  return {
    page: '',
    title: '',
    url: ''
  };
}

function createEmptyMenuItem(): MenuItemDraft {
  return {
    page: '',
    title: '',
    url: '',
    menuLinks: []
  };
}

function moveArrayItem<TValue>(items: TValue[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function buildMenuItemLabel(menu: MenuDraft, itemIndex: number) {
  const item = menu.menuItems[itemIndex];
  return item?.title.trim() || `Menu item ${itemIndex + 1}`;
}

function buildMenuLinkLabel(menu: MenuDraft, itemIndex: number, linkIndex: number) {
  const link = menu.menuItems[itemIndex]?.menuLinks[linkIndex];
  return link?.title.trim() || `Submenu link ${linkIndex + 1}`;
}

function getDefaultPath(): MenuFieldPath {
  return { kind: 'root' };
}

function pathExists(menu: MenuDraft, path: MenuFieldPath) {
  switch (path.kind) {
    case 'root':
    case 'root-field':
      return true;
    case 'menu-item':
      return path.itemIndex >= 0 && path.itemIndex < menu.menuItems.length;
    case 'menu-link':
      return (
        path.itemIndex >= 0 &&
        path.itemIndex < menu.menuItems.length &&
        path.linkIndex >= 0 &&
        path.linkIndex < menu.menuItems[path.itemIndex].menuLinks.length
      );
    default:
      return false;
  }
}

export function encodeMenuFieldPath(path: MenuFieldPath) {
  switch (path.kind) {
    case 'root':
      return 'root';
    case 'root-field':
      return ['root-field', path.field].join('|');
    case 'menu-item':
      return ['menu-item', String(path.itemIndex), path.field].join('|');
    case 'menu-link':
      return ['menu-link', String(path.itemIndex), String(path.linkIndex), path.field].join('|');
    default:
      return 'root';
  }
}

export function decodeMenuFieldPath(pathKey: string): MenuFieldPath | null {
  const parts = pathKey.split('|');

  switch (parts[0]) {
    case 'root':
      return parts.length === 1 ? { kind: 'root' } : null;
    case 'root-field':
      return parts.length === 2 &&
        (parts[1] === 'logoPrimary' || parts[1] === 'logoSecondary' || parts[1] === 'onlineGivingButtonText')
        ? { field: parts[1], kind: 'root-field' }
        : null;
    case 'menu-item': {
      const itemIndex = Number(parts[1]);

      return parts.length === 3 &&
        Number.isInteger(itemIndex) &&
        (parts[2] === 'title' || parts[2] === 'url' || parts[2] === 'page')
        ? { field: parts[2], itemIndex, kind: 'menu-item' }
        : null;
    }
    case 'menu-link': {
      const itemIndex = Number(parts[1]);
      const linkIndex = Number(parts[2]);

      return parts.length === 4 &&
        Number.isInteger(itemIndex) &&
        Number.isInteger(linkIndex) &&
        (parts[3] === 'title' || parts[3] === 'url' || parts[3] === 'page')
        ? { field: parts[3], itemIndex, kind: 'menu-link', linkIndex }
        : null;
    }
    default:
      return null;
  }
}

function adjustPathForMovedItem(path: MenuFieldPath, fromIndex: number, toIndex: number): MenuFieldPath {
  if (path.kind !== 'menu-item' && path.kind !== 'menu-link') {
    return path;
  }

  if (path.itemIndex === fromIndex) {
    return { ...path, itemIndex: toIndex };
  }

  if (fromIndex < toIndex && path.itemIndex > fromIndex && path.itemIndex <= toIndex) {
    return { ...path, itemIndex: path.itemIndex - 1 };
  }

  if (fromIndex > toIndex && path.itemIndex >= toIndex && path.itemIndex < fromIndex) {
    return { ...path, itemIndex: path.itemIndex + 1 };
  }

  return path;
}

function adjustPathForMovedLink(
  path: MenuFieldPath,
  itemIndex: number,
  fromIndex: number,
  toIndex: number
): MenuFieldPath {
  if (path.kind !== 'menu-link' || path.itemIndex !== itemIndex) {
    return path;
  }

  if (path.linkIndex === fromIndex) {
    return { ...path, linkIndex: toIndex };
  }

  if (fromIndex < toIndex && path.linkIndex > fromIndex && path.linkIndex <= toIndex) {
    return { ...path, linkIndex: path.linkIndex - 1 };
  }

  if (fromIndex > toIndex && path.linkIndex >= toIndex && path.linkIndex < fromIndex) {
    return { ...path, linkIndex: path.linkIndex + 1 };
  }

  return path;
}

function getBreadcrumbs(menu: MenuDraft, path: MenuFieldPath): MenuBreadcrumb[] {
  const breadcrumbs: MenuBreadcrumb[] = [{ label: 'Menu Overview', path: { kind: 'root' } }];

  if (path.kind === 'menu-item' || path.kind === 'menu-link') {
    breadcrumbs.push({
      label: buildMenuItemLabel(menu, path.itemIndex),
      path: { field: 'title', itemIndex: path.itemIndex, kind: 'menu-item' }
    });
  }

  if (path.kind === 'menu-link') {
    breadcrumbs.push({
      label: buildMenuLinkLabel(menu, path.itemIndex, path.linkIndex),
      path: { field: 'title', itemIndex: path.itemIndex, kind: 'menu-link', linkIndex: path.linkIndex }
    });
  }

  return breadcrumbs;
}

export function useMenuEditorController({ menu, onChange }: MenuEditorControllerOptions): MenuEditorController {
  const [activePath, setActivePathState] = useState<MenuFieldPath>(() => getDefaultPath());
  const fieldSelection = useAdminFieldSelection<string>({
    revealField: (fieldKey) => {
      const decodedPath = decodeMenuFieldPath(fieldKey);

      if (decodedPath) {
        setActivePathState(decodedPath);
      }
    }
  });

  const selection = useMemo(
    () => ({
      item:
        activePath.kind === 'menu-item' || activePath.kind === 'menu-link'
          ? menu.menuItems[activePath.itemIndex]
          : undefined,
      itemIndex: activePath.kind === 'menu-item' || activePath.kind === 'menu-link' ? activePath.itemIndex : -1,
      link:
        activePath.kind === 'menu-link'
          ? menu.menuItems[activePath.itemIndex]?.menuLinks[activePath.linkIndex]
          : undefined,
      linkIndex: activePath.kind === 'menu-link' ? activePath.linkIndex : -1
    }),
    [activePath, menu.menuItems]
  );

  const activePathKey = useMemo(() => encodeMenuFieldPath(activePath), [activePath]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(menu, activePath), [activePath, menu]);

  const registerField = useCallback(
    (path: Exclude<MenuFieldPath, { kind: 'root' }>) => fieldSelection.registerField(encodeMenuFieldPath(path)),
    [fieldSelection]
  );

  const setActivePath = useCallback(
    (path: MenuFieldPath, options?: SelectMenuFieldOptions) => {
      setActivePathState(path);

      if (path.kind === 'root') {
        return;
      }

      if (options?.focus) {
        fieldSelection.selectFieldKey(encodeMenuFieldPath(path), { focus: true });
      }
    },
    [fieldSelection]
  );

  const selectPathKey = useCallback(
    (pathKey: string) => {
      const path = decodeMenuFieldPath(pathKey);

      if (!path || !pathExists(menu, path)) {
        return;
      }

      setActivePath(path, { focus: true });
    },
    [menu, setActivePath]
  );

  const commitMenu = useCallback(
    (nextMenu: MenuDraft, nextPath?: MenuFieldPath, options?: SelectMenuFieldOptions) => {
      onChange(nextMenu);

      const resolvedPath = nextPath && pathExists(nextMenu, nextPath) ? nextPath : getDefaultPath();
      setActivePath(resolvedPath, options);
    },
    [onChange, setActivePath]
  );

  const updateRootField = useCallback(
    (field: MenuRootField, value: string) => {
      commitMenu({ ...menu, [field]: value }, { field, kind: 'root-field' });
    },
    [commitMenu, menu]
  );

  const addMenuItem = useCallback(() => {
    const nextMenu = {
      ...menu,
      menuItems: [...menu.menuItems, createEmptyMenuItem()]
    };

    commitMenu(
      nextMenu,
      { field: 'title', itemIndex: nextMenu.menuItems.length - 1, kind: 'menu-item' },
      { focus: true }
    );
  }, [commitMenu, menu]);

  const updateMenuItemField = useCallback(
    (itemIndex: number, field: MenuItemField, value: string) => {
      const nextMenu = {
        ...menu,
        menuItems: menu.menuItems.map((item, currentItemIndex) =>
          currentItemIndex === itemIndex ? { ...item, [field]: value } : item
        )
      };

      commitMenu(nextMenu, { field, itemIndex, kind: 'menu-item' });
    },
    [commitMenu, menu]
  );

  const removeMenuItem = useCallback(
    (itemIndex: number) => {
      const nextMenu = {
        ...menu,
        menuItems: menu.menuItems.filter((_, currentItemIndex) => currentItemIndex !== itemIndex)
      };

      commitMenu(nextMenu, { kind: 'root' });
    },
    [commitMenu, menu]
  );

  const moveMenuItems = useCallback(
    (itemIndex: number, nextIndex: number) => {
      if (itemIndex < 0 || nextIndex < 0 || itemIndex >= menu.menuItems.length || nextIndex >= menu.menuItems.length) {
        return;
      }

      const nextMenu = {
        ...menu,
        menuItems: moveArrayItem(menu.menuItems, itemIndex, nextIndex)
      };

      commitMenu(nextMenu, adjustPathForMovedItem(activePath, itemIndex, nextIndex));
    },
    [activePath, commitMenu, menu]
  );

  const addMenuLink = useCallback(
    (itemIndex: number) => {
      const nextMenu = {
        ...menu,
        menuItems: menu.menuItems.map((item, currentItemIndex) =>
          currentItemIndex === itemIndex ? { ...item, menuLinks: [...item.menuLinks, createEmptyMenuLink()] } : item
        )
      };

      const nextLinkIndex = nextMenu.menuItems[itemIndex]?.menuLinks.length
        ? nextMenu.menuItems[itemIndex].menuLinks.length - 1
        : 0;
      commitMenu(nextMenu, { field: 'title', itemIndex, kind: 'menu-link', linkIndex: nextLinkIndex }, { focus: true });
    },
    [commitMenu, menu]
  );

  const updateMenuLinkField = useCallback(
    (itemIndex: number, linkIndex: number, field: MenuItemField, value: string) => {
      const nextMenu = {
        ...menu,
        menuItems: menu.menuItems.map((item, currentItemIndex) =>
          currentItemIndex === itemIndex
            ? {
                ...item,
                menuLinks: item.menuLinks.map((link, currentLinkIndex) =>
                  currentLinkIndex === linkIndex ? { ...link, [field]: value } : link
                )
              }
            : item
        )
      };

      commitMenu(nextMenu, { field, itemIndex, kind: 'menu-link', linkIndex });
    },
    [commitMenu, menu]
  );

  const removeMenuLink = useCallback(
    (itemIndex: number, linkIndex: number) => {
      const nextMenu = {
        ...menu,
        menuItems: menu.menuItems.map((item, currentItemIndex) =>
          currentItemIndex === itemIndex
            ? { ...item, menuLinks: item.menuLinks.filter((_, currentLinkIndex) => currentLinkIndex !== linkIndex) }
            : item
        )
      };

      commitMenu(nextMenu, { field: 'title', itemIndex, kind: 'menu-item' });
    },
    [commitMenu, menu]
  );

  const moveMenuLinks = useCallback(
    (itemIndex: number, linkIndex: number, nextIndex: number) => {
      const item = menu.menuItems[itemIndex];

      if (
        !item ||
        linkIndex < 0 ||
        nextIndex < 0 ||
        linkIndex >= item.menuLinks.length ||
        nextIndex >= item.menuLinks.length
      ) {
        return;
      }

      const nextMenu = {
        ...menu,
        menuItems: menu.menuItems.map((currentItem, currentItemIndex) =>
          currentItemIndex === itemIndex
            ? { ...currentItem, menuLinks: moveArrayItem(currentItem.menuLinks, linkIndex, nextIndex) }
            : currentItem
        )
      };

      commitMenu(nextMenu, adjustPathForMovedLink(activePath, itemIndex, linkIndex, nextIndex));
    },
    [activePath, commitMenu, menu]
  );

  useEffect(() => {
    if (!pathExists(menu, activePath)) {
      setActivePathState(getDefaultPath());
    }
  }, [activePath, menu]);

  return {
    activePath,
    activePathKey,
    breadcrumbs,
    menu,
    registerField,
    selectPathKey,
    selection,
    setActivePath,
    updateRootField,
    addMenuItem,
    updateMenuItemField,
    removeMenuItem,
    moveMenuItems,
    addMenuLink,
    updateMenuLinkField,
    removeMenuLink,
    moveMenuLinks
  };
}
