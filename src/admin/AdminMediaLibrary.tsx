'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';

import { AdminSelectableCard, AdminSurfacePanel } from './components/AdminCards';
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

interface AdminMediaLibraryProps {
  allowedFolderIds?: MediaFolderId[];
  description?: string;
  onChange?: () => Promise<void> | void;
  onSelectAsset?: (asset: MediaAsset) => void;
  repoClient: AdminRepoClient;
  selectionFilter?: MediaSelectionFilter;
  selectionLabel?: string;
  title?: string;
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
  onSelect
}: {
  active: boolean;
  asset: MediaAsset;
  onSelect: (assetId: string) => void;
}) {
  return (
    <AdminSelectableCard
      active={active}
      activeShadow
      onClick={() => onSelect(asset.id)}
      sx={{
        px: 2,
        py: 1.5
      }}
    >
      <Stack spacing={0.5} sx={{ width: '100%' }}>
        {asset.kind === 'image' ? (
          <Box
            component="img"
            src={asset.publicPath}
            alt={asset.name}
            sx={{
              display: 'block',
              maxHeight: 80,
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: '4px',
              backgroundColor: active ? 'rgba(255,255,255,0.15)' : '#f4efe7',
              mb: 0.5
            }}
          />
        ) : null}
        <Typography sx={{ fontWeight: 700 }}>{asset.name}</Typography>
        <Typography sx={{ color: active ? 'inherit' : '#6a5448', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          {asset.kind === 'image' ? 'Image' : 'File'}
        </Typography>
      </Stack>
    </AdminSelectableCard>
  );
}

export function AdminMediaLibrary({
  allowedFolderIds,
  description,
  onChange,
  onSelectAsset,
  repoClient,
  selectionFilter = 'all',
  selectionLabel = 'Use selected asset',
  title = 'Media library'
}: AdminMediaLibraryProps) {
  const folderOptions = useMemo(
    () => MEDIA_FOLDERS.filter((folder) => !allowedFolderIds || allowedFolderIds.includes(folder.folderId)),
    [allowedFolderIds]
  );
  const [activeFolderId, setActiveFolderId] = useState<MediaFolderId>(folderOptions[0]?.folderId || 'shared');
  const [uploadName, setUploadName] = useState('');
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
  const selectedAsset =
    visibleAssets.find((asset) => asset.id === libraryState.selectedAssetId) || visibleAssets[0] || null;
  const isUploading = libraryState.uploadStatus === 'uploading';
  const uploadAccept = selectionFilter === 'images' ? 'image/*' : undefined;

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
        fileName: uploadName.trim() || file.name,
        folderId: activeFolderId,
        replaceAsset: replaceAsset ? selectedAsset : undefined
      });

      await refreshContent(uploadedAsset.id);
      setUploadName('');
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
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography sx={{ color: '#5d4a40', lineHeight: 1.7 }}>Loading the repository-backed media folders.</Typography>
        <LinearProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <div>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography sx={{ color: '#5d4a40', lineHeight: 1.7, mt: 1 }}>
          {description || 'Browse the media folders, upload new assets, and replace existing files.'}
        </Typography>
      </div>

      {libraryState.error ? <Alert severity="error">{libraryState.error}</Alert> : null}
      {libraryState.uploadMessage ? <Alert severity="success">{libraryState.uploadMessage}</Alert> : null}
      {libraryState.uploadError ? <Alert severity="error">{libraryState.uploadError}</Alert> : null}
      {libraryState.status === 'loading' ? <LinearProgress /> : null}

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

      <Stack direction={{ xl: 'row', xs: 'column' }} spacing={2} alignItems="flex-start">
        <AdminSurfacePanel
          tone="sidebar"
          spacing={1.5}
          sx={{
            flexShrink: 0,
            p: 2,
            width: { xl: 360, xs: '100%' }
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>{getFolderLabel(activeFolderId)}</Typography>
          <Typography sx={{ color: '#616169', lineHeight: 1.7 }}>{getFolderDescription(activeFolderId)}</Typography>
          <Divider />
          {visibleAssets.length === 0 ? (
            <Alert severity="info">No matching assets are available in this folder yet.</Alert>
          ) : (
            visibleAssets.map((asset) => (
              <AssetButton
                key={asset.id}
                active={asset.id === selectedAsset?.id}
                asset={asset}
                onSelect={selectAsset}
              />
            ))
          )}
        </AdminSurfacePanel>

        <AdminSurfacePanel
          spacing={2}
          sx={{
            flex: 1,
            minWidth: 0,
            p: { md: 2.5, xs: 2 }
          }}
        >
          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
            <div>
              <Typography sx={{ fontWeight: 700 }}>Selected asset</Typography>
              <Typography sx={{ color: '#616169', lineHeight: 1.7, mt: 1 }}>
                Pick an existing asset to reuse, or upload a new file into the current folder.
              </Typography>
            </div>
            <Typography sx={{ color: '#616169', fontSize: '0.9rem' }}>
              {visibleAssets.length} asset{visibleAssets.length === 1 ? '' : 's'}
            </Typography>
          </Stack>

          {selectedAsset ? (
            <Stack spacing={1.25}>
              {selectedAsset.kind === 'image' ? (
                <Box
                  component="img"
                  src={selectedAsset.publicPath}
                  alt={selectedAsset.name}
                  sx={{
                    alignSelf: 'flex-start',
                    border: '1px solid rgba(127, 35, 44, 0.12)',
                    borderRadius: '4px',
                    display: 'block',
                    maxHeight: 220,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#f4efe7'
                  }}
                />
              ) : null}
              <Typography sx={{ fontWeight: 700 }}>{selectedAsset.name}</Typography>
            </Stack>
          ) : (
            <Alert severity="info">Select an asset to inspect it here.</Alert>
          )}

          <Divider />

          <Stack spacing={2}>
            <TextField
              label="New upload file name"
              value={uploadName}
              onChange={(event) => setUploadName(event.target.value)}
              helperText="Optional. Leave blank to use the uploaded file name."
              fullWidth
            />
            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5}>
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
            </Stack>
          </Stack>
        </AdminSurfacePanel>
      </Stack>
    </Stack>
  );
}
