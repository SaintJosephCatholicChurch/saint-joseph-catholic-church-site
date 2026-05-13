'use client';

import { useEffect, useRef, useState } from 'react';

import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
import { useAdminFieldSelection } from '../components/adminPreviewSelection';
import { useAdminQueryParamState } from '../../useAdminQueryParamState';
import { HomepageFeaturedEditor } from './HomepageFeaturedEditor';
import { HomepageHeroEditor } from './HomepageHeroEditor';
import { HomepagePreview } from './HomepagePreview';
import { HomepageSectionsEditor } from './HomepageSectionsEditor';
import { HomepageSlidesEditor } from './HomepageSlidesEditor';
import { parseHomepageFieldKey, type HomepageFieldKey } from './fieldKeys';

import type { HomepageDraft } from '../../content/writableComplexContent';
import type { ReactNode } from 'react';

const HOMEPAGE_EDITOR_TABS = ['featured', 'hero', 'sections', 'slides'] as const;
const HOMEPAGE_SECTION_PANELS = ['editor', 'preview'] as const;

type HomepageEditorTabId = (typeof HOMEPAGE_EDITOR_TABS)[number];

interface HomepageSectionProps {
  headerActions: ReactNode;
  onChange: (value: HomepageDraft) => void;
  onSelectDailyReadingsBackground: () => void;
  onSelectFeaturedImage: (index: number) => void;
  onSelectScheduleBackground: () => void;
  onSelectSlideImage: (index: number) => void;
  value: HomepageDraft;
}

export function HomepageSection({
  headerActions,
  onChange,
  onSelectDailyReadingsBackground,
  onSelectFeaturedImage,
  onSelectScheduleBackground,
  onSelectSlideImage,
  value
}: HomepageSectionProps) {
  const pendingExpandedFocusFieldKeyRef = useRef<HomepageFieldKey | null>(null);
  const pendingPreviewSelectionFieldKeyRef = useRef<HomepageFieldKey | null>(null);
  const [expandedSlideIndexes, setExpandedSlideIndexes] = useState<number[]>([]);
  const [homepageTab, setHomepageTab] = useAdminQueryParamState<HomepageEditorTabId>({
    allowedValues: HOMEPAGE_EDITOR_TABS,
    defaultValue: 'hero',
    paramName: 'homepageTab'
  });
  const [panel, setPanel] = useAdminQueryParamState({
    allowedValues: HOMEPAGE_SECTION_PANELS,
    defaultValue: 'editor',
    paramName: 'homepagePanel'
  });
  const selection = useAdminFieldSelection<HomepageFieldKey>({
    revealField: (fieldKey) => {
      const parsedFieldKey = parseHomepageFieldKey(fieldKey);

      if (!parsedFieldKey) {
        return;
      }

      setHomepageTab(parsedFieldKey.tab);

      if (parsedFieldKey.tab === 'slides') {
        setExpandedSlideIndexes((currentValue) =>
          currentValue.includes(parsedFieldKey.index) ? currentValue : [...currentValue, parsedFieldKey.index]
        );
      }
    }
  });

  useEffect(() => {
    setExpandedSlideIndexes((currentValue) => currentValue.filter((index) => index < value.slides.length));
  }, [value.slides.length]);

  useEffect(() => {
    if (panel !== 'editor' || !pendingPreviewSelectionFieldKeyRef.current) {
      return;
    }

    const fieldKey = pendingPreviewSelectionFieldKeyRef.current;
    pendingPreviewSelectionFieldKeyRef.current = null;
    selectFieldKeyInEditor(fieldKey);
  }, [panel, selection]);

  function selectFieldKeyInEditor(fieldKey: HomepageFieldKey) {
    const parsedFieldKey = parseHomepageFieldKey(fieldKey);

    if (parsedFieldKey?.tab === 'slides' && !expandedSlideIndexes.includes(parsedFieldKey.index)) {
      pendingExpandedFocusFieldKeyRef.current = fieldKey;
      selection.setActiveFieldKey(fieldKey);
      return;
    }

    pendingExpandedFocusFieldKeyRef.current = null;
    selection.selectFieldKey(fieldKey);
  }

  function handleExpandedEntered(index: number) {
    const pendingFieldKey = pendingExpandedFocusFieldKeyRef.current;

    if (!pendingFieldKey) {
      return;
    }

    const parsedFieldKey = parseHomepageFieldKey(pendingFieldKey);

    if (!parsedFieldKey || parsedFieldKey.tab !== 'slides' || parsedFieldKey.index !== index) {
      return;
    }

    pendingExpandedFocusFieldKeyRef.current = null;
    requestAnimationFrame(() => {
      selection.selectFieldKey(pendingFieldKey);
    });
  }

  function handleSelectFieldKey(fieldKey: HomepageFieldKey) {
    if (panel === 'preview') {
      pendingPreviewSelectionFieldKeyRef.current = fieldKey;
      setPanel('editor');
      return;
    }

    selectFieldKeyInEditor(fieldKey);
  }

  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Homepage"
      editorWidth={460}
      panelParamName="homepagePanel"
      editor={
        <Stack spacing={2}>
          <Tabs
            value={homepageTab}
            onChange={(_, next: HomepageEditorTabId) => setHomepageTab(next)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{ borderBottom: 1, borderColor: 'divider', mx: -0.5 }}
          >
            <Tab label="Hero" value="hero" />
            <Tab label="Sections" value="sections" />
            <Tab label="Slides" value="slides" />
            <Tab label="Featured" value="featured" />
          </Tabs>

          {homepageTab === 'hero' ? (
            <HomepageHeroEditor registerField={selection.registerField} value={value} onChange={onChange} />
          ) : null}
          {homepageTab === 'sections' ? (
            <HomepageSectionsEditor
              registerField={selection.registerField}
              value={value}
              onChange={onChange}
              onSelectDailyReadingsBackground={onSelectDailyReadingsBackground}
              onSelectScheduleBackground={onSelectScheduleBackground}
            />
          ) : null}
          {homepageTab === 'slides' ? (
            <HomepageSlidesEditor
              activeFieldKey={selection.activeFieldKey || undefined}
              expandedIndexes={expandedSlideIndexes}
              onChange={onChange}
              onExpandedEntered={handleExpandedEntered}
              onSelectSlideImage={onSelectSlideImage}
              onToggleExpanded={(index, expanded) =>
                setExpandedSlideIndexes((currentValue) => {
                  if (expanded) {
                    return currentValue.includes(index) ? currentValue : [...currentValue, index];
                  }

                  return currentValue.filter((entryIndex) => entryIndex !== index);
                })
              }
              registerField={selection.registerField}
              value={value}
            />
          ) : null}
          {homepageTab === 'featured' ? (
            <HomepageFeaturedEditor
              registerField={selection.registerField}
              value={value}
              onChange={onChange}
              onSelectFeaturedImage={onSelectFeaturedImage}
            />
          ) : null}
        </Stack>
      }
      preview={
        <HomepagePreview
          activeFieldKey={selection.activeFieldKey || undefined}
          draft={value}
          interactive
          onSelectFieldKey={handleSelectFieldKey}
        />
      }
    />
  );
}
