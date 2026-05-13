'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { AdminSectionCard } from '../../components/AdminCards';
import { HOMEPAGE_HERO_FIELD_KEYS, type HomepageFieldKey } from './fieldKeys';

import type { HomepageDraft } from '../../content/writableComplexContent';

interface HomepageHeroEditorProps {
  onChange: (value: HomepageDraft) => void;
  registerField: (fieldKey: HomepageFieldKey) => (element: HTMLElement | null) => void;
  value: HomepageDraft;
}

export function HomepageHeroEditor({ onChange, registerField, value }: HomepageHeroEditorProps) {
  return (
    <AdminSectionCard title="Hero and livestream">
      <TextField
        label="Invitation text"
        inputRef={registerField(HOMEPAGE_HERO_FIELD_KEYS.invitationText)}
        value={value.invitationText}
        onChange={(event) => onChange({ ...value, invitationText: event.target.value })}
        fullWidth
      />
      <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
        <TextField
          label="Live stream button title"
          inputRef={registerField(HOMEPAGE_HERO_FIELD_KEYS.liveStreamButtonTitle)}
          value={value.liveStreamButtonTitle}
          onChange={(event) => onChange({ ...value, liveStreamButtonTitle: event.target.value })}
          fullWidth
        />
        <TextField
          label="Live stream button URL"
          inputRef={registerField(HOMEPAGE_HERO_FIELD_KEYS.liveStreamButtonUrl)}
          value={value.liveStreamButtonUrl}
          onChange={(event) => onChange({ ...value, liveStreamButtonUrl: event.target.value })}
          fullWidth
        />
      </Stack>
    </AdminSectionCard>
  );
}
