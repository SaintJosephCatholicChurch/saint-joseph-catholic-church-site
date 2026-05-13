'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { AdminImagePathField } from '../../components/AdminImagePathField';

import type { SiteConfigDraft } from '../../content/writableStructuredContent';

interface SiteConfigEditorProps {
  onChange: (value: SiteConfigDraft) => void;
  onSelectSiteImage: () => void;
  value: SiteConfigDraft;
}

export function SiteConfigEditor({ onChange, onSelectSiteImage, value }: SiteConfigEditorProps) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Site title"
        value={value.siteTitle}
        onChange={(event) =>
          onChange({
            ...value,
            siteTitle: event.target.value
          })
        }
        fullWidth
      />
      <TextField
        label="Site description"
        value={value.siteDescription}
        onChange={(event) =>
          onChange({
            ...value,
            siteDescription: event.target.value
          })
        }
        fullWidth
        multiline
        minRows={3}
      />
      <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
        <TextField
          label="Base URL"
          value={value.baseUrl}
          onChange={(event) =>
            onChange({
              ...value,
              baseUrl: event.target.value
            })
          }
          fullWidth
        />
        <TextField
          label="Privacy policy URL"
          value={value.privacyPolicyUrl}
          onChange={(event) =>
            onChange({
              ...value,
              privacyPolicyUrl: event.target.value
            })
          }
          fullWidth
        />
      </Stack>
      <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
        <AdminImagePathField
          onSelectImage={onSelectSiteImage}
          previewAlt={value.siteTitle || 'Site image preview'}
          value={value.siteImage}
        />
        <TextField
          label="Posts per page"
          value={value.postsPerPage}
          onChange={(event) =>
            onChange({
              ...value,
              postsPerPage: event.target.value
            })
          }
          fullWidth
        />
      </Stack>
      <TextField
        label="Site keywords"
        helperText="Separate keywords with commas or line breaks."
        value={value.siteKeywords}
        onChange={(event) =>
          onChange({
            ...value,
            siteKeywords: event.target.value
          })
        }
        fullWidth
        multiline
        minRows={3}
      />
    </Stack>
  );
}
