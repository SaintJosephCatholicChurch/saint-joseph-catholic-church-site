'use client';

import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
import { MenuEditor } from './MenuEditor';
import { MenuPreview } from './MenuPreview';
import { useMenuEditorController } from './useMenuEditorController';
import { useAdminQueryParamState } from '../../useAdminQueryParamState';

import type { ChurchDetailsDraft, MenuDraft } from '../../content/writableStructuredContent';
import type { ReactNode } from 'react';

interface MenuSectionProps {
  churchDetails: ChurchDetailsDraft;
  headerActions: ReactNode;
  onChange: (value: MenuDraft) => void;
  value: MenuDraft;
}

const CONTENT_SECTION_PANELS = ['editor', 'preview'] as const;

export function MenuSection({ churchDetails, headerActions, onChange, value }: MenuSectionProps) {
  const controller = useMenuEditorController({ menu: value, onChange });
  const [panel, setPanel] = useAdminQueryParamState({
    allowedValues: CONTENT_SECTION_PANELS,
    defaultValue: 'editor',
    paramName: 'menuPanel'
  });

  function handleSelectPathKey(pathKey: string) {
    if (panel === 'preview') {
      setPanel('editor');
    }

    controller.selectPathKey(pathKey);
  }

  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Menu And Logo"
      panelParamName="menuPanel"
      editor={<MenuEditor controller={controller} />}
      preview={
        <MenuPreview
          activePathKey={controller.activePathKey}
          churchDetails={churchDetails}
          interactive
          menu={controller.menu}
          onSelectPathKey={handleSelectPathKey}
        />
      }
    />
  );
}
