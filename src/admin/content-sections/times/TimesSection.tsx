'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
import type { HomepageDraft } from '../../content/writableComplexContent';
import { useAdminQueryParamState } from '../../useAdminQueryParamState';
import { TimesEditorWorkspace } from './TimesEditorWorkspace';
import { TimesPreview } from './TimesPreview';
import { useTimesEditorController } from './useTimesEditorController';

import type { Times } from '../../../interface';

interface TimesSectionProps {
  headerActions: ReactNode;
  homepageDraft: HomepageDraft;
  onChange: (times: Times[]) => void;
  value: Times[];
}

const CONTENT_SECTION_PANELS = ['editor', 'preview'] as const;

export function TimesSection({ headerActions, homepageDraft, onChange, value }: TimesSectionProps) {
  const controller = useTimesEditorController({
    onChange,
    times: value
  });
  const pendingPreviewSelectionPathKeyRef = useRef<string | null>(null);
  const [panel, setPanel] = useAdminQueryParamState({
    allowedValues: CONTENT_SECTION_PANELS,
    defaultValue: 'editor',
    paramName: 'timesPanel'
  });
  const activeCategoryId = controller.activePath.kind === 'root' ? null : controller.activePath.categoryId;

  useEffect(() => {
    if (panel !== 'editor' || !pendingPreviewSelectionPathKeyRef.current) {
      return;
    }

    const pathKey = pendingPreviewSelectionPathKeyRef.current;
    pendingPreviewSelectionPathKeyRef.current = null;
    controller.selectPathKey(pathKey);
  }, [controller, panel]);

  function handleSelectPathKey(pathKey: string) {
    if (panel === 'preview') {
      pendingPreviewSelectionPathKeyRef.current = pathKey;
      setPanel('editor');
      return;
    }

    controller.selectPathKey(pathKey);
  }

  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Times"
      panelParamName="timesPanel"
      editor={<TimesEditorWorkspace controller={controller} />}
      preview={
        <TimesPreview
          activePathKey={controller.activePathKey}
          draft={homepageDraft}
          interactive
          onSelectPathKey={handleSelectPathKey}
          selectedCategoryId={activeCategoryId || undefined}
          times={controller.times}
        />
      }
    />
  );
}
