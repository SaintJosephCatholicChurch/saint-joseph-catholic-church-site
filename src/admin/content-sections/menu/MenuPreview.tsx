'use client';

import Box from '@mui/material/Box';

import { AdminPagePreviewFrame } from '../../AdminPagePreviewFrame';
import Navigation from '../../../components/navigation/Navigation';
import { getAdminPreviewFieldTargetProps, handleAdminPreviewSelectionClick } from '../components/adminPreviewSelection';
import { buildChurchDetailsPreviewData } from '../church-details/previewData';
import { encodeMenuFieldPath } from './useMenuEditorController';

import type { MenuData } from '../../../interface';
import type {
  ChurchDetailsDraft,
  MenuDraft,
  MenuItemDraft,
  MenuLinkDraft
} from '../../content/writableStructuredContent';

interface MenuPreviewProps {
  activePathKey?: string;
  churchDetails: ChurchDetailsDraft;
  interactive?: boolean;
  menu: MenuDraft;
  onSelectPathKey?: (pathKey: string) => void;
}

function buildMenuPreviewData(menu: MenuDraft): MenuData {
  return {
    logo: {
      primary: menu.logoPrimary || 'St. Joseph',
      secondary: menu.logoSecondary || 'Catholic Church'
    },
    menu_items: menu.menuItems.map((item: MenuItemDraft) => ({
      menu_links: item.menuLinks.map((link: MenuLinkDraft) => ({
        page: link.page.trim() || undefined,
        title: link.title.trim(),
        url: link.url.trim() || undefined
      })),
      page: item.page.trim() || undefined,
      title: item.title.trim() || 'Untitled',
      url: item.url.trim() || undefined
    })),
    online_giving_button_text: menu.onlineGivingButtonText || 'Give'
  };
}

export function MenuPreview({
  activePathKey,
  churchDetails,
  interactive = false,
  menu,
  onSelectPathKey
}: MenuPreviewProps) {
  const menuDetails = buildMenuPreviewData(menu);

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    handleAdminPreviewSelectionClick(event, {
      interactive,
      onSelectFieldKey: onSelectPathKey
    });
  }

  return (
    <AdminPagePreviewFrame>
      <Box
        id="drawer-container"
        onClickCapture={handleClickCapture}
        sx={{
          background: 'linear-gradient(180deg, #f8f1e8 0%, #ffffff 100%)',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          maxWidth: '100%',
          minHeight: '100%',
          overflow: 'hidden',
          position: 'relative',
          width: '100%'
        }}
      >
        <Navigation
          adminSelection={{
            activePathKey,
            disableMenuLinkNavigation: interactive,
            getMenuItemProps: (itemIndex) =>
              getAdminPreviewFieldTargetProps(encodeMenuFieldPath({ field: 'title', itemIndex, kind: 'menu-item' })),
            getMenuLinkProps: (itemIndex, linkIndex) =>
              getAdminPreviewFieldTargetProps(
                encodeMenuFieldPath({ field: 'title', itemIndex, kind: 'menu-link', linkIndex })
              ),
            giveButtonProps: getAdminPreviewFieldTargetProps(
              encodeMenuFieldPath({ field: 'onlineGivingButtonText', kind: 'root-field' })
            ),
            logoPrimaryProps: getAdminPreviewFieldTargetProps(
              encodeMenuFieldPath({ field: 'logoPrimary', kind: 'root-field' })
            ),
            logoSecondaryProps: getAdminPreviewFieldTargetProps(
              encodeMenuFieldPath({ field: 'logoSecondary', kind: 'root-field' })
            )
          }}
          churchDetails={buildChurchDetailsPreviewData(churchDetails)}
          menuDetails={menuDetails}
          inCMS
        />
      </Box>
    </AdminPagePreviewFrame>
  );
}
