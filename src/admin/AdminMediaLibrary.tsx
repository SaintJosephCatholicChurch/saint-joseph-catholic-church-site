'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AdminSelectableCard, AdminSurfacePanel } from './components/AdminCards';
import {
  AdminResponsiveActionRow,
  AdminSupportPreviewInset,
  AdminSupportPreviewSurface
} from './components/AdminSupport';
import {
  loadBulletinMediaContent,
  MEDIA_FOLDERS,
  uploadMediaAsset,
  type BulletinMediaContent,
  type MediaAsset,
  type MediaFolderId
} from './content/writableBulletinsMediaContent';

import type { AdminRepoClient } from './services/adminTypes';

type MediaSelectionFilter = 'all' | 'files' | 'images';
export type MediaLibraryViewMode = 'grid' | 'list';

interface AdminMediaLibraryProps {
  allowedFolderIds?: MediaFolderId[];
  currentAssetPublicPath?: string;
  description?: string;
  onChange?: () => Promise<void> | void;
  onSelectAsset?: (asset: MediaAsset) => void;
  repoClient: AdminRepoClient;
  selectionFilter?: MediaSelectionFilter;
  selectionLabel?: string;
  showHeader?: boolean;
  title?: string;
  viewMode?: MediaLibraryViewMode;
}

interface MediaLibraryState {
  content: BulletinMediaContent | null;
  error: string | null;
  selectedAssetId: string | null;
  status: 'error' | 'idle' | 'loading' | 'success';
  uploadError: string | null;
  uploadMessage: string | null;
  uploadStatus: 'error' | 'idle' | 'uploading' | 'success';
}

const INITIAL_LIBRARY_STATE: MediaLibraryState = {
  content: null,
  error: null,
  selectedAssetId: null,
  status: 'idle',
  uploadError: null,
  uploadMessage: null,
  uploadStatus: 'idle'
};

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The media library failed to load.';
}

function filterAssets(assets: MediaAsset[], selectionFilter: MediaSelectionFilter) {
  switch (selectionFilter) {
    case 'images':
      return assets.filter((asset) => asset.kind === 'image');
    case 'files':
      return assets.filter((asset) => asset.kind === 'file');
    default:
      return assets;
  }
}

function getFolderLabel(folderId: MediaFolderId) {
  return MEDIA_FOLDERS.find((folder) => folder.folderId === folderId)?.label || folderId;
}

function getFolderDescription(folderId: MediaFolderId) {
  return MEDIA_FOLDERS.find((folder) => folder.folderId === folderId)?.description || '';
}

function AssetButton({
  active,
  asset,
  current,
  assetRef,
  viewMode,
  onSelect
}: {
  active: boolean;
  asset: MediaAsset;
  assetRef?: (element: HTMLButtonElement | null) => void;
  current: boolean;
  viewMode: MediaLibraryViewMode;
  onSelect: (assetId: string) => void;
}) {
  return (
    <AdminSelectableCard
      active={active}
      activeShadow
      onClick={() => onSelect(asset.id)}
      ref={assetRef}
      sx={{
        minWidth: 0,
        px: viewMode === 'grid' ? 1.5 : 2,
        py: viewMode === 'grid' ? 1.25 : 1.5,
        width: '100%'
      }}
    >
      <Stack spacing={0.5} sx={{ minWidth: 0, width: '100%' }}>
        {current ? (
          <Typography sx={{ color: active ? 'inherit' : '#7f232c', fontSize: '0.78rem', fontWeight: 700 }}>
            Currently used
          </Typography>
        ) : null}
        {asset.kind === 'image' ? (
          <AdminSupportPreviewInset
            sx={{
              backgroundColor: active ? 'rgba(255,255,255,0.15)' : '#f4efe7',
              mb: 0.5,
              p: 0.5
            }}
          >
            <Box
              component="img"
              src={asset.publicPath}
              alt={asset.name}
              sx={{
                display: 'block',
                maxHeight: viewMode === 'grid' ? 120 : 80,
                maxWidth: '100%',
                objectFit: 'contain'
              }}
            />
          </AdminSupportPreviewInset>
        ) : null}
        <Typography
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            fontWeight: 700,
            lineHeight: 1.35,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}
        >
          {asset.name}
        </Typography>
        <Typography sx={{ color: active ? 'inherit' : '#6a5448', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          {asset.kind === 'image' ? 'Image' : 'File'}
        </Typography>
      </Stack>
    </AdminSelectableCard>
  );
}

export function AdminMediaLibraryViewToggle({
  value,
  onChange
}: {
  value: MediaLibraryViewMode;
  onChange: (viewMode: MediaLibraryViewMode) => void;
}) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_event, nextValue: MediaLibraryViewMode | null) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
      sx={{
        backgroundColor: 'rgba(250, 245, 238, 0.9)',
        border: '1px solid rgba(127, 35, 44, 0.16)',
        borderRadius: '999px',
        overflow: 'hidden'
      }}
    >
      <ToggleButton value="list" sx={{ gap: 0.75, px: 1.25, textTransform: 'none' }}>
        <ViewListIcon fontSize="small" />
        List
      </ToggleButton>
      <ToggleButton value="grid" sx={{ gap: 0.75, px: 1.25, textTransform: 'none' }}>
        <GridViewIcon fontSize="small" />
        Grid
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export function AdminMediaLibrary({
  allowedFolderIds,
  currentAssetPublicPath,
  description,
  onChange,
  onSelectAsset,
  repoClient,
  selectionFilter = 'all',
  selectionLabel = 'Use selected asset',
  showHeader = true,
  title = 'Media library',
  viewMode = 'list'
}: AdminMediaLibraryProps) {
  const assetButtonRegistryRef = useRef(new Map<string, HTMLButtonElement>());
  const currentAssetInitializationKeyRef = useRef<string | null>(null);
  const pendingScrollAssetIdRef = useRef<string | null>(null);
  const folderOptions = useMemo(
    () => MEDIA_FOLDERS.filter((folder) => !allowedFolderIds || allowedFolderIds.includes(folder.folderId)),
    [allowedFolderIds]
  );
  const [activeFolderId, setActiveFolderId] = useState<MediaFolderId>(folderOptions[0]?.folderId || 'shared');
  const [libraryState, setLibraryState] = useState<MediaLibraryState>(INITIAL_LIBRARY_STATE);

  useEffect(() => {
    if (folderOptions.length === 0) {
      return;
    }

    if (!folderOptions.some((folder) => folder.folderId === activeFolderId)) {
      setActiveFolderId(folderOptions[0].folderId);
    }
  }, [activeFolderId, folderOptions]);

  useEffect(() => {
    currentAssetInitializationKeyRef.current = null;
    pendingScrollAssetIdRef.current = null;
  }, [currentAssetPublicPath]);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      setLibraryState((currentState) => ({
        ...currentState,
        error: null,
        status: 'loading'
      }));

      try {
        const content = await loadBulletinMediaContent(repoClient);

        if (cancelled) {
          return;
        }

        setLibraryState((currentState) => ({
          ...currentState,
          content,
          error: null,
          selectedAssetId: currentState.selectedAssetId,
          status: 'success'
        }));
      } catch (error) {
        if (cancelled) {
          return;
        }

        setLibraryState((currentState) => ({
          ...currentState,
          error: buildErrorMessage(error),
          status: 'error'
        }));
      }
    }

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [repoClient]);

  const visibleAssets = filterAssets(libraryState.content?.mediaAssets[activeFolderId] || [], selectionFilter);
  const currentAsset = useMemo(() => {
    if (!currentAssetPublicPath || !libraryState.content) {
      return null;
    }

    for (const folder of folderOptions) {
      const assets = libraryState.content.mediaAssets[folder.folderId] || [];
      const asset = assets.find((entry) => entry.publicPath === currentAssetPublicPath);

      if (asset) {
        return asset;
      }
    }

    return null;
  }, [currentAssetPublicPath, folderOptions, libraryState.content]);
  const selectedAsset =
    visibleAssets.find((asset) => asset.id === libraryState.selectedAssetId) || visibleAssets[0] || null;
  const isUploading = libraryState.uploadStatus === 'uploading';
  const uploadAccept = selectionFilter === 'images' ? 'image/*' : undefined;
  const shouldShowFolderButtons = folderOptions.length > 1;

  useEffect(() => {
    if (!currentAsset) {
      return;
    }

    const initializationKey = `${currentAsset.folderId}:${currentAsset.publicPath}`;

    if (currentAssetInitializationKeyRef.current === initializationKey) {
      return;
    }

    currentAssetInitializationKeyRef.current = initializationKey;
    pendingScrollAssetIdRef.current = currentAsset.id;

    if (activeFolderId !== currentAsset.folderId) {
      setActiveFolderId(currentAsset.folderId);
    }

    setLibraryState((currentState) => ({
      ...currentState,
      selectedAssetId: currentAsset.id
    }));
  }, [activeFolderId, currentAsset]);

  useEffect(() => {
    const pendingAssetId = pendingScrollAssetIdRef.current;

    if (!pendingAssetId) {
      return;
    }

    const assetButton = assetButtonRegistryRef.current.get(pendingAssetId);

    if (!assetButton) {
      return;
    }

    pendingScrollAssetIdRef.current = null;

    requestAnimationFrame(() => {
      assetButton.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
    });
  }, [activeFolderId, selectedAsset?.id, viewMode, visibleAssets.length]);

  function registerAssetButton(assetId: string) {
    return (element: HTMLButtonElement | null) => {
      if (!element) {
        assetButtonRegistryRef.current.delete(assetId);
        return;
      }

      assetButtonRegistryRef.current.set(assetId, element);
    };
  }

  function selectAsset(assetId: string) {
    setLibraryState((currentState) => ({
      ...currentState,
      selectedAssetId: assetId,
      uploadError: null,
      uploadMessage: null,
      uploadStatus: 'idle'
    }));
  }

  async function refreshContent(preferredAssetId?: string) {
    const content = await loadBulletinMediaContent(repoClient);
    const nextVisibleAssets = filterAssets(content.mediaAssets[activeFolderId] || [], selectionFilter);
    const selectedAssetId =
      preferredAssetId && nextVisibleAssets.some((asset) => asset.id === preferredAssetId)
        ? preferredAssetId
        : nextVisibleAssets[0]?.id || null;

    setLibraryState((currentState) => ({
      ...currentState,
      content,
      error: null,
      selectedAssetId,
      status: 'success'
    }));
  }

  async function handleUpload(file: File, replaceAsset: boolean) {
    setLibraryState((currentState) => ({
      ...currentState,
      uploadError: null,
      uploadMessage: null,
      uploadStatus: 'uploading'
    }));

    try {
      const uploadedAsset = await uploadMediaAsset(repoClient, {
        file,
        fileName: file.name,
        folderId: activeFolderId,
        replaceAsset: replaceAsset ? selectedAsset : undefined
      });

      await refreshContent(uploadedAsset.id);
      setLibraryState((currentState) => ({
        ...currentState,
        uploadError: null,
        uploadMessage: `${replaceAsset ? 'Replaced' : 'Uploaded'} ${uploadedAsset.name} in ${getFolderLabel(activeFolderId)}.`,
        uploadStatus: 'success'
      }));

      await Promise.resolve(onChange?.());
    } catch (error) {
      setLibraryState((currentState) => ({
        ...currentState,
        uploadError: buildErrorMessage(error),
        uploadStatus: 'error'
      }));
    }
  }

  if (libraryState.status === 'loading' && !libraryState.content) {
    return (
      <Stack spacing={2}>
        {showHeader ? <Typography sx={{ fontWeight: 700 }}>{title}</Typography> : null}
        <Typography sx={{ color: '#5d4a40', lineHeight: 1.7 }}>Loading the repository-backed media folders.</Typography>
        <LinearProgress />
      </Stack>
    );
  }

  const actionRow = (
    <AdminResponsiveActionRow spacing={1.5} sx={viewMode === 'grid' ? { justifyContent: 'flex-end' } : undefined}>
      <Button component="label" disabled={isUploading} variant="contained">
        Upload new asset
        <input
          hidden
          type="file"
          accept={uploadAccept}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void handleUpload(file, false);
            }

            event.target.value = '';
          }}
        />
      </Button>
      <Button component="label" disabled={isUploading || !selectedAsset} variant="outlined">
        Replace selected asset
        <input
          hidden
          type="file"
          accept={uploadAccept}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void handleUpload(file, true);
            }

            event.target.value = '';
          }}
        />
      </Button>
      {onSelectAsset ? (
        <Button
          disabled={!selectedAsset}
          onClick={() => selectedAsset && onSelectAsset(selectedAsset)}
          variant="outlined"
        >
          {selectionLabel}
        </Button>
      ) : null}
    </AdminResponsiveActionRow>
  );

  return (
    <Stack spacing={2}>
      {showHeader ? (
        <div>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography sx={{ color: '#5d4a40', lineHeight: 1.7, mt: 1 }}>
            {description || 'Browse the media folders, upload new assets, and replace existing files.'}
          </Typography>
        </div>
      ) : null}

      {libraryState.error ? <Alert severity="error">{libraryState.error}</Alert> : null}
      {libraryState.uploadMessage ? <Alert severity="success">{libraryState.uploadMessage}</Alert> : null}
      {libraryState.uploadError ? <Alert severity="error">{libraryState.uploadError}</Alert> : null}
      {libraryState.status === 'loading' ? <LinearProgress /> : null}

      {shouldShowFolderButtons || viewMode === 'grid' ? (
        <Stack
          direction={{ lg: 'row', xs: 'column' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ lg: 'center', xs: 'stretch' }}
        >
          {shouldShowFolderButtons ? (
            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} flexWrap="wrap">
              {folderOptions.map((folder) => (
                <Button
                  key={folder.folderId}
                  color="inherit"
                  onClick={() => setActiveFolderId(folder.folderId)}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  variant={folder.folderId === activeFolderId ? 'contained' : 'outlined'}
                >
                  {folder.label}
                </Button>
              ))}
            </Stack>
          ) : null}
          {viewMode === 'grid' ? actionRow : null}
        </Stack>
      ) : null}

      <Stack direction={{ xl: 'row', xs: 'column' }} spacing={2} alignItems="flex-start">
        <AdminSurfacePanel
          tone="sidebar"
          spacing={1.5}
          sx={{
            flex: viewMode === 'grid' ? 1 : undefined,
            flexShrink: 0,
            p: 2,
            width: { xl: viewMode === 'grid' ? '100%' : 360, xs: '100%' }
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>{getFolderLabel(activeFolderId)}</Typography>
          <Typography sx={{ color: '#616169', lineHeight: 1.7 }}>{getFolderDescription(activeFolderId)}</Typography>
          <Divider />
          {visibleAssets.length === 0 ? (
            <Alert severity="info">No matching assets are available in this folder yet.</Alert>
          ) : (
            <Box
              sx={
                viewMode === 'grid'
                  ? {
                      display: 'grid',
                      gap: 1.5,
                      gridTemplateColumns: {
                        xs: 'repeat(auto-fit, minmax(170px, 1fr))',
                        lg: 'repeat(3, minmax(0, 1fr))',
                        xl: 'repeat(4, minmax(0, 1fr))'
                      }
                    }
                  : {
                      display: 'grid',
                      gap: 1.5,
                      gridTemplateColumns: 'minmax(0, 1fr)'
                    }
              }
            >
              {visibleAssets.map((asset) => (
                <AssetButton
                  key={asset.id}
                  active={asset.id === selectedAsset?.id}
                  asset={asset}
                  assetRef={registerAssetButton(asset.id)}
                  current={asset.id === currentAsset?.id}
                  onSelect={selectAsset}
                  viewMode={viewMode}
                />
              ))}
            </Box>
          )}
        </AdminSurfacePanel>

        {viewMode === 'list' ? (
          <AdminSurfacePanel
            spacing={2}
            sx={{
              flex: 1,
              minWidth: 0,
              p: { md: 2.5, xs: 2 },
              position: { xl: 'sticky' },
              top: { xl: 0 }
            }}
          >
            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
              <div>
                <Typography sx={{ fontWeight: 700 }}>Selected asset</Typography>
                <Typography sx={{ color: '#616169', lineHeight: 1.7, mt: 1 }}>
                  Pick an existing asset to reuse, or upload a new file into the current folder.
                </Typography>
              </div>
            </Stack>

            {selectedAsset ? (
              <AdminSupportPreviewSurface sx={{ p: 1.25 }}>
                {selectedAsset.kind === 'image' ? (
                  <AdminSupportPreviewInset sx={{ alignSelf: 'flex-start', maxWidth: '100%', p: 0.5 }}>
                    <Box
                      component="img"
                      src={selectedAsset.publicPath}
                      alt={selectedAsset.name}
                      sx={{
                        display: 'block',
                        maxHeight: 220,
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </AdminSupportPreviewInset>
                ) : null}
                <Typography
                  sx={{ fontWeight: 700, overflowWrap: 'anywhere', whiteSpace: 'normal', wordBreak: 'break-word' }}
                >
                  {selectedAsset.name}
                </Typography>
              </AdminSupportPreviewSurface>
            ) : (
              <Alert severity="info">Select an asset to inspect it here.</Alert>
            )}

            <Divider />

            <Stack spacing={2}>{actionRow}</Stack>
          </AdminSurfacePanel>
        ) : null}
      </Stack>
    </Stack>
  );
}
