'use client';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

import { AdminMediaLibrary, AdminMediaLibraryViewToggle, type MediaLibraryViewMode } from './AdminMediaLibrary';
import { AdminDialogTitle } from './components/AdminDialogTitle';
import { ChurchDetailsSection } from './content-sections/church-details/ChurchDetailsSection';
import { ContentSectionsEditorBase } from './content-sections/components/ContentSectionsEditorBase';
import { HomepageSection } from './content-sections/homepage/HomepageSection';
import { MenuSection } from './content-sections/menu/MenuSection';
import { SiteConfigSection } from './content-sections/site-config/SiteConfigSection';
import { StaffSection } from './content-sections/staff/StaffSection';
import { StylesSection } from './content-sections/styles/StylesSection';
import { TagsSection } from './content-sections/tags/TagsSection';
import { TimesSection } from './content-sections/times/TimesSection';
import {
  COMPLEX_WRITABLE_SECTIONS,
  createComplexDraft,
  loadComplexContent,
  saveComplexSection,
  type ComplexSectionId,
  type HomepageFeaturedDraft,
  type HomepageSlideDraft
} from './content/writableComplexContent';
import {
  createStructuredDraft,
  loadStructuredContent,
  saveStructuredSection,
  STRUCTURED_WRITABLE_SECTIONS,
  type StructuredSectionId
} from './content/writableStructuredContent';

import type { MediaAsset, MediaFolderId } from './content/writableBulletinsMediaContent';
import type { AdminRepoClient } from './services/adminTypes';

export type ContentEditorSectionId = ComplexSectionId | StructuredSectionId;

interface ContentEditorProps {
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient;
  showIntroAlert?: boolean;
  visibleSections?: ContentEditorSectionId[];
}

interface StructuredSectionsEditorProps {
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient;
  showIntroAlert: boolean;
  visibleSections: StructuredSectionId[];
}

interface ComplexSectionsEditorProps {
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient;
  showIntroAlert: boolean;
  visibleSections: ComplexSectionId[];
}

const STRUCTURED_SECTION_IDS = STRUCTURED_WRITABLE_SECTIONS.map((section) => section.id) as StructuredSectionId[];
const COMPLEX_SECTION_IDS = COMPLEX_WRITABLE_SECTIONS.map((section) => section.id) as ComplexSectionId[];
const ALL_CONTENT_SECTION_IDS = [...STRUCTURED_SECTION_IDS, ...COMPLEX_SECTION_IDS] as ContentEditorSectionId[];

type StructuredImagePickerTarget = 'footer-background' | 'site-image' | null;

type ComplexImagePickerTarget =
  | { kind: 'homepage-featured'; index: number }
  | { kind: 'homepage-daily-readings-background' }
  | { kind: 'homepage-schedule-background' }
  | { kind: 'homepage-slide'; index: number }
  | { kind: 'staff'; index: number }
  | null;

function isStructuredSectionId(sectionId: ContentEditorSectionId): sectionId is StructuredSectionId {
  return STRUCTURED_SECTION_IDS.includes(sectionId as StructuredSectionId);
}

function isComplexSectionId(sectionId: ContentEditorSectionId): sectionId is ComplexSectionId {
  return COMPLEX_SECTION_IDS.includes(sectionId as ComplexSectionId);
}

function StructuredSectionsEditor({
  onSaved,
  repoClient,
  showIntroAlert,
  visibleSections
}: StructuredSectionsEditorProps) {
  const [imagePickerTarget, setImagePickerTarget] = useState<StructuredImagePickerTarget>(null);
  const [mediaLibraryViewMode, setMediaLibraryViewMode] = useState<MediaLibraryViewMode>('list');

  return (
    <ContentSectionsEditorBase
      createDraft={createStructuredDraft}
      failureMessage="The structured content editor failed to load."
      introAlert={
        <>These low-risk JSON-backed sections now edit and save directly through the live site-owned admin route.</>
      }
      loadContent={loadStructuredContent}
      loadingTitle="Loading editable structured content"
      onSaved={onSaved}
      renderSections={({ draft, renderSectionHeaderActions, shouldRenderSection, visibleSectionIds, updateDraft }) => {
        const shouldUseChurchDetailsPreview = shouldRenderSection('churchDetails') && visibleSectionIds.length === 1;

        return (
          <>
            {shouldRenderSection('churchDetails') ? (
              <ChurchDetailsSection
                headerActions={renderSectionHeaderActions('churchDetails')}
                value={draft.churchDetails}
                onChange={(value) => updateDraft('churchDetails', value)}
                showPreview={shouldUseChurchDetailsPreview}
              />
            ) : null}

            {shouldRenderSection('siteConfig') ? (
              <SiteConfigSection
                headerActions={renderSectionHeaderActions('siteConfig')}
                value={draft.siteConfig}
                onChange={(value) => updateDraft('siteConfig', value)}
                onSelectSiteImage={() => setImagePickerTarget('site-image')}
              />
            ) : null}

            {shouldRenderSection('menu') ? (
              <MenuSection
                churchDetails={draft.churchDetails}
                headerActions={renderSectionHeaderActions('menu')}
                value={draft.menu}
                onChange={(value) => updateDraft('menu', value)}
              />
            ) : null}

            {shouldRenderSection('tags') ? (
              <TagsSection
                headerActions={renderSectionHeaderActions('tags')}
                value={draft.tags}
                onChange={(value) => updateDraft('tags', value)}
              />
            ) : null}

            {shouldRenderSection('styles') ? (
              <StylesSection
                headerActions={renderSectionHeaderActions('styles')}
                value={draft.styles}
                onChange={(value) => updateDraft('styles', value)}
                onSelectFooterBackground={() => setImagePickerTarget('footer-background')}
              />
            ) : null}
          </>
        );
      }}
      renderDialogs={({ draft, updateDraft, repoClient: activeRepoClient, onSaved: handleSaved }) => (
        <Dialog fullWidth maxWidth="lg" onClose={() => setImagePickerTarget(null)} open={Boolean(imagePickerTarget)}>
          <AdminDialogTitle
            actions={<AdminMediaLibraryViewToggle value={mediaLibraryViewMode} onChange={setMediaLibraryViewMode} />}
            onClose={() => setImagePickerTarget(null)}
          >
            {imagePickerTarget === 'footer-background' ? 'Select footer background' : 'Select image'}
          </AdminDialogTitle>
          <DialogContent dividers>
            <AdminMediaLibrary
              allowedFolderIds={['shared']}
              currentAssetPublicPath={
                imagePickerTarget === 'footer-background' ? draft.styles.footerBackground : draft.siteConfig.siteImage
              }
              onChange={handleSaved}
              onSelectAsset={(asset) => {
                if (imagePickerTarget === 'footer-background') {
                  updateDraft('styles', {
                    footerBackground: asset.publicPath
                  });
                } else {
                  updateDraft('siteConfig', {
                    ...draft.siteConfig,
                    siteImage: asset.publicPath
                  });
                }

                setImagePickerTarget(null);
              }}
              repoClient={activeRepoClient}
              selectionFilter="images"
              selectionLabel="Use selected image"
              showHeader={false}
              title="Select image"
              viewMode={mediaLibraryViewMode}
            />
          </DialogContent>
        </Dialog>
      )}
      repoClient={repoClient}
      saveSection={saveStructuredSection}
      sections={STRUCTURED_WRITABLE_SECTIONS}
      showIntroAlert={showIntroAlert}
      visibleSections={visibleSections}
    />
  );
}

function ComplexSectionsEditor({ onSaved, repoClient, showIntroAlert, visibleSections }: ComplexSectionsEditorProps) {
  const [imagePickerTarget, setImagePickerTarget] = useState<ComplexImagePickerTarget>(null);
  const [mediaLibraryViewMode, setMediaLibraryViewMode] = useState<MediaLibraryViewMode>('list');

  return (
    <ContentSectionsEditorBase
      createDraft={createComplexDraft}
      failureMessage="The complex structured editor failed to load."
      introAlert={
        <>
          Homepage repeaters, the full schedule widget, and staff entries now save directly through the live site-owned
          admin route.
        </>
      }
      loadContent={loadComplexContent}
      loadingTitle="Loading complex structured content"
      onSaved={onSaved}
      renderSections={({ draft, renderSectionHeaderActions, shouldRenderSection, updateDraft }) => (
        <>
          {shouldRenderSection('homepage') ? (
            <HomepageSection
              headerActions={renderSectionHeaderActions('homepage')}
              value={draft.homepage}
              onChange={(homepage) => updateDraft('homepage', homepage)}
              onSelectDailyReadingsBackground={() =>
                setImagePickerTarget({ kind: 'homepage-daily-readings-background' })
              }
              onSelectFeaturedImage={(index) => setImagePickerTarget({ kind: 'homepage-featured', index })}
              onSelectScheduleBackground={() => setImagePickerTarget({ kind: 'homepage-schedule-background' })}
              onSelectSlideImage={(index) => setImagePickerTarget({ kind: 'homepage-slide', index })}
            />
          ) : null}

          {shouldRenderSection('times') ? (
            <TimesSection
              headerActions={renderSectionHeaderActions('times')}
              homepageDraft={draft.homepage}
              value={draft.times}
              onChange={(times) => updateDraft('times', times)}
            />
          ) : null}

          {shouldRenderSection('staff') ? (
            <StaffSection
              headerActions={renderSectionHeaderActions('staff')}
              value={draft.staff}
              onChange={(staff) => updateDraft('staff', staff)}
              onSelectImage={(index) => setImagePickerTarget({ kind: 'staff', index })}
            />
          ) : null}
        </>
      )}
      renderDialogs={({ draft, updateDraft, repoClient: activeRepoClient, onSaved: handleSaved }) => {
        const imagePickerTitle = imagePickerTarget?.kind === 'staff' ? 'Select staff image' : 'Select image';
        const imagePickerFolders: MediaFolderId[] = imagePickerTarget?.kind === 'staff' ? ['staff'] : ['shared'];

        function updateHomepageSlide(index: number, nextValue: Partial<HomepageSlideDraft>) {
          const slides = draft.homepage.slides.map((slide, slideIndex) =>
            slideIndex === index ? { ...slide, ...nextValue } : slide
          );
          updateDraft('homepage', { ...draft.homepage, slides });
        }

        function updateHomepageFeatured(index: number, nextValue: Partial<HomepageFeaturedDraft>) {
          const featured = draft.homepage.featured.map((item, itemIndex) =>
            itemIndex === index ? ({ ...item, ...nextValue } as HomepageFeaturedDraft) : item
          );
          updateDraft('homepage', { ...draft.homepage, featured });
        }

        function handleImageAssetSelected(asset: MediaAsset) {
          if (!imagePickerTarget) {
            return;
          }

          if (imagePickerTarget.kind === 'homepage-schedule-background') {
            updateDraft('homepage', {
              ...draft.homepage,
              scheduleSectionBackground: asset.publicPath
            });
          }

          if (imagePickerTarget.kind === 'homepage-daily-readings-background') {
            updateDraft('homepage', {
              ...draft.homepage,
              dailyReadingsBackground: asset.publicPath
            });
          }

          if (imagePickerTarget.kind === 'homepage-slide') {
            updateHomepageSlide(imagePickerTarget.index, { image: asset.publicPath });
          }

          if (imagePickerTarget.kind === 'homepage-featured') {
            updateHomepageFeatured(imagePickerTarget.index, { image: asset.publicPath });
          }

          if (imagePickerTarget.kind === 'staff') {
            updateDraft(
              'staff',
              draft.staff.map((entry, entryIndex) =>
                entryIndex === imagePickerTarget.index ? { ...entry, picture: asset.publicPath } : entry
              )
            );
          }

          setImagePickerTarget(null);
        }

        return (
          <Dialog fullWidth maxWidth="lg" onClose={() => setImagePickerTarget(null)} open={Boolean(imagePickerTarget)}>
            <AdminDialogTitle
              actions={<AdminMediaLibraryViewToggle value={mediaLibraryViewMode} onChange={setMediaLibraryViewMode} />}
              onClose={() => setImagePickerTarget(null)}
            >
              {imagePickerTitle}
            </AdminDialogTitle>
            <DialogContent dividers>
              <AdminMediaLibrary
                allowedFolderIds={imagePickerFolders}
                currentAssetPublicPath={
                  imagePickerTarget?.kind === 'homepage-schedule-background'
                    ? draft.homepage.scheduleSectionBackground
                    : imagePickerTarget?.kind === 'homepage-daily-readings-background'
                      ? draft.homepage.dailyReadingsBackground
                      : imagePickerTarget?.kind === 'homepage-slide'
                        ? draft.homepage.slides[imagePickerTarget.index]?.image
                        : imagePickerTarget?.kind === 'homepage-featured'
                          ? draft.homepage.featured[imagePickerTarget.index]?.image
                          : imagePickerTarget?.kind === 'staff'
                            ? draft.staff[imagePickerTarget.index]?.picture
                            : undefined
                }
                onChange={handleSaved}
                onSelectAsset={handleImageAssetSelected}
                repoClient={activeRepoClient}
                selectionFilter="images"
                selectionLabel="Use selected image"
                showHeader={false}
                title={imagePickerTitle}
                viewMode={mediaLibraryViewMode}
              />
            </DialogContent>
          </Dialog>
        );
      }}
      repoClient={repoClient}
      saveSection={saveComplexSection}
      sections={COMPLEX_WRITABLE_SECTIONS}
      showIntroAlert={showIntroAlert}
      visibleSections={visibleSections}
    />
  );
}

export function ContentEditor({ onSaved, repoClient, showIntroAlert = true, visibleSections }: ContentEditorProps) {
  const requestedSectionIds = visibleSections || ALL_CONTENT_SECTION_IDS;
  const structuredVisibleSections = requestedSectionIds.filter(isStructuredSectionId);
  const complexVisibleSections = requestedSectionIds.filter(isComplexSectionId);

  if (structuredVisibleSections.length === 0 && complexVisibleSections.length === 0) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden', width: '100%' }}>
      {structuredVisibleSections.length > 0 ? (
        <StructuredSectionsEditor
          onSaved={onSaved}
          repoClient={repoClient}
          showIntroAlert={showIntroAlert}
          visibleSections={structuredVisibleSections}
        />
      ) : null}
      {complexVisibleSections.length > 0 ? (
        <ComplexSectionsEditor
          onSaved={onSaved}
          repoClient={repoClient}
          showIntroAlert={showIntroAlert && structuredVisibleSections.length === 0}
          visibleSections={complexVisibleSections}
        />
      ) : null}
    </Stack>
  );
}
