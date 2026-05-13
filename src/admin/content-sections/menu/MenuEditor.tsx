'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AdminSortableAccordionRepeaterCard } from '../../components/AdminCards';
import { AdminCompactActionBar } from '../../components/AdminWorkspace';

import type { MenuDraft, MenuItemDraft, MenuLinkDraft } from '../../content/writableStructuredContent';
import type { MenuBreadcrumb, MenuFieldPath, MenuRootField } from './useMenuEditorController';

interface MenuEditorControllerLike {
  activePath: MenuFieldPath;
  addMenuItem: () => void;
  addMenuLink: (itemIndex: number) => void;
  breadcrumbs: MenuBreadcrumb[];
  menu: MenuDraft;
  moveMenuItems: (itemIndex: number, nextIndex: number) => void;
  moveMenuLinks: (itemIndex: number, linkIndex: number, nextIndex: number) => void;
  registerField: (path: Exclude<MenuFieldPath, { kind: 'root' }>) => (element: HTMLElement | null) => void;
  removeMenuItem: (itemIndex: number) => void;
  removeMenuLink: (itemIndex: number, linkIndex: number) => void;
  setActivePath: (path: MenuFieldPath) => void;
  selection: {
    item: MenuItemDraft | undefined;
    itemIndex: number;
    link: MenuLinkDraft | undefined;
    linkIndex: number;
  };
  updateMenuItemField: (itemIndex: number, field: 'page' | 'title' | 'url', value: string) => void;
  updateMenuLinkField: (itemIndex: number, linkIndex: number, field: 'page' | 'title' | 'url', value: string) => void;
  updateRootField: (field: MenuRootField, value: string) => void;
}

interface MenuEditorProps {
  controller: MenuEditorControllerLike;
}

function buildMenuItemSummary(item: MenuItemDraft) {
  if (item.menuLinks.length > 0) {
    return `${item.menuLinks.length} submenu ${item.menuLinks.length === 1 ? 'link' : 'links'}`;
  }

  if (item.url.trim()) {
    return item.url.trim();
  }

  if (item.page.trim()) {
    return `Page: ${item.page.trim()}`;
  }

  return 'No destination set';
}

function buildMenuLinkSummary(link: MenuLinkDraft) {
  if (link.url.trim()) {
    return link.url.trim();
  }

  if (link.page.trim()) {
    return `Page: ${link.page.trim()}`;
  }

  return 'No destination set';
}

function buildRootFieldLabel(field: MenuRootField) {
  switch (field) {
    case 'logoPrimary':
      return 'Logo primary text';
    case 'logoSecondary':
      return 'Logo secondary text';
    case 'onlineGivingButtonText':
      return 'Online giving button text';
    default:
      return 'Field';
  }
}

function renderBreadcrumbs(breadcrumbs: MenuBreadcrumb[], onSelectPath: (path: MenuFieldPath) => void) {
  const parentBreadcrumbs = breadcrumbs.slice(0, -1);

  if (parentBreadcrumbs.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
      {parentBreadcrumbs.map((crumb, index) => {
        const isLast = index === parentBreadcrumbs.length - 1;

        return (
          <Stack key={`${crumb.label}-${index}`} direction="row" spacing={0.75} alignItems="center">
            <Link
              component="button"
              type="button"
              underline="hover"
              color="inherit"
              onClick={() => onSelectPath(crumb.path)}
              sx={{ color: '#6e5b53', fontSize: '0.9rem', textAlign: 'left' }}
            >
              {crumb.label}
            </Link>
            {!isLast ? <Typography sx={{ color: '#6e5b53', fontSize: '0.9rem' }}>/</Typography> : null}
          </Stack>
        );
      })}
    </Stack>
  );
}

export function MenuEditor({ controller }: MenuEditorProps) {
  function renderRootView() {
    return (
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <TextField
          label="Logo primary text"
          value={controller.menu.logoPrimary}
          inputRef={controller.registerField({ field: 'logoPrimary', kind: 'root-field' })}
          onChange={(event) => controller.updateRootField('logoPrimary', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'logoPrimary', kind: 'root-field' })}
          fullWidth
        />
        <TextField
          label="Logo secondary text"
          value={controller.menu.logoSecondary}
          inputRef={controller.registerField({ field: 'logoSecondary', kind: 'root-field' })}
          onChange={(event) => controller.updateRootField('logoSecondary', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'logoSecondary', kind: 'root-field' })}
          fullWidth
        />
        <TextField
          label="Online giving button text"
          value={controller.menu.onlineGivingButtonText}
          inputRef={controller.registerField({ field: 'onlineGivingButtonText', kind: 'root-field' })}
          onChange={(event) => controller.updateRootField('onlineGivingButtonText', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'onlineGivingButtonText', kind: 'root-field' })}
          fullWidth
        />

        <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Menu items
          </Typography>
          <Button onClick={controller.addMenuItem} startIcon={<AddIcon />} variant="outlined">
            Add menu item
          </Button>
        </Stack>

        {controller.menu.menuItems.length ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) {
                return;
              }

              const oldIndex = controller.menu.menuItems.findIndex((_, index) => `menu-item-${index}` === active.id);
              const newIndex = controller.menu.menuItems.findIndex((_, index) => `menu-item-${index}` === over.id);

              if (oldIndex >= 0 && newIndex >= 0) {
                controller.moveMenuItems(oldIndex, newIndex);
              }
            }}
          >
            <SortableContext
              items={controller.menu.menuItems.map((_, index) => `menu-item-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={1.5}>
                {controller.menu.menuItems.map((item, index) => (
                  <AdminSortableAccordionRepeaterCard
                    key={`menu-item-${index}`}
                    id={`menu-item-${index}`}
                    title={item.title.trim() || `Menu item ${index + 1}`}
                    summary={buildMenuItemSummary(item)}
                    active={
                      controller.activePath.kind === 'menu-item' || controller.activePath.kind === 'menu-link'
                        ? controller.activePath.itemIndex === index
                        : false
                    }
                    onSummaryClick={() =>
                      controller.setActivePath({ field: 'title', itemIndex: index, kind: 'menu-item' })
                    }
                    summaryActions={
                      <IconButton
                        aria-label={`Delete menu item ${index + 1}`}
                        onClick={() => controller.removeMenuItem(index)}
                        size="small"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    }
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : (
          <Alert severity="info">No menu items yet. Add your first top-level navigation item.</Alert>
        )}
      </Stack>
    );
  }

  function renderItemView() {
    const item = controller.selection.item;
    const itemIndex = controller.selection.itemIndex;

    if (!item || itemIndex < 0) {
      return null;
    }

    return (
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {renderBreadcrumbs(controller.breadcrumbs, controller.setActivePath)}
        <AdminCompactActionBar
          onBack={() => controller.setActivePath({ kind: 'root' })}
          backLabel="Menu Overview"
          actions={
            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5}>
              <IconButton
                aria-label={`Delete menu item ${itemIndex + 1}`}
                onClick={() => controller.removeMenuItem(itemIndex)}
                size="small"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          }
        />

        <TextField
          label="Title"
          value={item.title}
          inputRef={controller.registerField({ field: 'title', itemIndex, kind: 'menu-item' })}
          onChange={(event) => controller.updateMenuItemField(itemIndex, 'title', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'title', itemIndex, kind: 'menu-item' })}
          fullWidth
        />
        <TextField
          label="URL"
          helperText="Optional. If both URL and page are set, URL wins."
          value={item.url}
          inputRef={controller.registerField({ field: 'url', itemIndex, kind: 'menu-item' })}
          onChange={(event) => controller.updateMenuItemField(itemIndex, 'url', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'url', itemIndex, kind: 'menu-item' })}
          fullWidth
        />
        <TextField
          label="Page slug"
          helperText="Optional. Use a site page slug without a leading slash."
          value={item.page}
          inputRef={controller.registerField({ field: 'page', itemIndex, kind: 'menu-item' })}
          onChange={(event) => controller.updateMenuItemField(itemIndex, 'page', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'page', itemIndex, kind: 'menu-item' })}
          fullWidth
        />

        <Stack spacing={1.5}>
          <Stack direction="column" spacing={1.5} justifyContent="space-between">
            <div>
              <Typography sx={{ fontWeight: 700 }}>Submenu links</Typography>
              <Typography sx={{ color: '#616169', lineHeight: 1.6, mt: 0.5 }}>
                Leave this empty for a standard top-level link.
              </Typography>
            </div>
            <Button
              color="inherit"
              onClick={() => controller.addMenuLink(itemIndex)}
              startIcon={<AddIcon />}
              variant="outlined"
            >
              Add submenu link
            </Button>
          </Stack>

          {item.menuLinks.length ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) {
                  return;
                }

                const oldIndex = item.menuLinks.findIndex(
                  (_, index) => `menu-link-${itemIndex}-${index}` === active.id
                );
                const newIndex = item.menuLinks.findIndex((_, index) => `menu-link-${itemIndex}-${index}` === over.id);

                if (oldIndex >= 0 && newIndex >= 0) {
                  controller.moveMenuLinks(itemIndex, oldIndex, newIndex);
                }
              }}
            >
              <SortableContext
                items={item.menuLinks.map((_, linkIndex) => `menu-link-${itemIndex}-${linkIndex}`)}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={1.5}>
                  {item.menuLinks.map((link, linkIndex) => (
                    <AdminSortableAccordionRepeaterCard
                      key={`menu-item-${itemIndex}-submenu-${linkIndex}`}
                      id={`menu-link-${itemIndex}-${linkIndex}`}
                      title={link.title.trim() || `Submenu link ${linkIndex + 1}`}
                      summary={buildMenuLinkSummary(link)}
                      active={
                        controller.activePath.kind === 'menu-link' &&
                        controller.activePath.itemIndex === itemIndex &&
                        controller.activePath.linkIndex === linkIndex
                      }
                      onSummaryClick={() =>
                        controller.setActivePath({ field: 'title', itemIndex, kind: 'menu-link', linkIndex })
                      }
                      summaryActions={
                        <IconButton
                          aria-label={`Delete submenu link ${linkIndex + 1}`}
                          onClick={() => controller.removeMenuLink(itemIndex, linkIndex)}
                          size="small"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      }
                    />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          ) : (
            <Alert severity="info">No submenu links yet.</Alert>
          )}
        </Stack>
      </Stack>
    );
  }

  function renderLinkView() {
    const itemIndex = controller.selection.itemIndex;
    const link = controller.selection.link;
    const linkIndex = controller.selection.linkIndex;

    if (!link || itemIndex < 0 || linkIndex < 0) {
      return null;
    }

    const currentItem = controller.menu.menuItems[itemIndex];

    return (
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {renderBreadcrumbs(controller.breadcrumbs, controller.setActivePath)}
        <AdminCompactActionBar
          onBack={() => controller.setActivePath({ field: 'title', itemIndex, kind: 'menu-item' })}
          backLabel={currentItem?.title.trim() || `Menu item ${itemIndex + 1}`}
          actions={
            <IconButton
              aria-label={`Delete submenu link ${linkIndex + 1}`}
              onClick={() => controller.removeMenuLink(itemIndex, linkIndex)}
              size="small"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          }
        />

        <TextField
          label="Title"
          value={link.title}
          inputRef={controller.registerField({ field: 'title', itemIndex, kind: 'menu-link', linkIndex })}
          onChange={(event) => controller.updateMenuLinkField(itemIndex, linkIndex, 'title', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'title', itemIndex, kind: 'menu-link', linkIndex })}
          fullWidth
        />
        <TextField
          label="URL"
          helperText="Optional. If both URL and page are set, URL wins."
          value={link.url}
          inputRef={controller.registerField({ field: 'url', itemIndex, kind: 'menu-link', linkIndex })}
          onChange={(event) => controller.updateMenuLinkField(itemIndex, linkIndex, 'url', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'url', itemIndex, kind: 'menu-link', linkIndex })}
          fullWidth
        />
        <TextField
          label="Page slug"
          helperText="Optional. Use a site page slug without a leading slash."
          value={link.page}
          inputRef={controller.registerField({ field: 'page', itemIndex, kind: 'menu-link', linkIndex })}
          onChange={(event) => controller.updateMenuLinkField(itemIndex, linkIndex, 'page', event.target.value)}
          onFocus={() => controller.setActivePath({ field: 'page', itemIndex, kind: 'menu-link', linkIndex })}
          fullWidth
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ minWidth: 0 }}>
      {controller.activePath.kind === 'menu-item'
        ? renderItemView()
        : controller.activePath.kind === 'menu-link'
          ? renderLinkView()
          : renderRootView()}
      {controller.activePath.kind === 'root-field' ? (
        <Typography sx={{ color: '#6e5b53', fontSize: '0.9rem' }}>
          Selected preview target: {buildRootFieldLabel(controller.activePath.field)}
        </Typography>
      ) : null}
    </Stack>
  );
}
