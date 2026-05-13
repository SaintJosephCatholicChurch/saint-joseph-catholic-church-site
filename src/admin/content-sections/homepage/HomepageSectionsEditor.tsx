'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { AdminSectionCard } from '../../components/AdminCards';
import { AdminImagePathField } from '../../components/AdminImagePathField';
import { HOMEPAGE_SECTION_FIELD_KEYS, type HomepageFieldKey } from './fieldKeys';

import type { HomepageDraft } from '../../content/writableComplexContent';

interface HomepageSectionsEditorProps {
  onChange: (value: HomepageDraft) => void;
  onSelectDailyReadingsBackground: () => void;
  onSelectScheduleBackground: () => void;
  registerField: (fieldKey: HomepageFieldKey) => (element: HTMLElement | null) => void;
  value: HomepageDraft;
}

export function HomepageSectionsEditor({
  onChange,
  onSelectDailyReadingsBackground,
  onSelectScheduleBackground,
  registerField,
  value
}: HomepageSectionsEditorProps) {
  return (
    <Stack spacing={2}>
      <AdminSectionCard title="Schedule and daily readings">
        <TextField
          label="Schedule section title"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.scheduleSectionTitle)}
          value={value.scheduleSectionTitle}
          onChange={(event) => onChange({ ...value, scheduleSectionTitle: event.target.value })}
          fullWidth
        />
        <AdminImagePathField
          actionButtonRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.scheduleSectionBackground)}
          buttonLabel="Select schedule background"
          onSelectImage={onSelectScheduleBackground}
          previewAlt="Schedule background preview"
          value={value.scheduleSectionBackground}
        />
        <TextField
          label="Daily readings title"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.dailyReadingsTitle)}
          value={value.dailyReadingsTitle}
          onChange={(event) => onChange({ ...value, dailyReadingsTitle: event.target.value })}
          fullWidth
        />
        <AdminImagePathField
          actionButtonRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.dailyReadingsBackground)}
          buttonLabel="Select daily readings background"
          onSelectImage={onSelectDailyReadingsBackground}
          previewAlt="Daily readings background preview"
          value={value.dailyReadingsBackground}
        />
        <TextField
          label="Daily readings subtitle"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.dailyReadingsSubtitle)}
          value={value.dailyReadingsSubtitle}
          onChange={(event) => onChange({ ...value, dailyReadingsSubtitle: event.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Newsletter banner">
        <TextField
          label="Newsletter banner title"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.newsletterBannerTitle)}
          value={value.newsletterBannerTitle}
          onChange={(event) => onChange({ ...value, newsletterBannerTitle: event.target.value })}
          fullWidth
        />
        <TextField
          label="Newsletter banner subtitle"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.newsletterBannerSubtitle)}
          value={value.newsletterBannerSubtitle}
          onChange={(event) => onChange({ ...value, newsletterBannerSubtitle: event.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Newsletter signup link"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.newsletterSignupLink)}
          value={value.newsletterSignupLink}
          onChange={(event) => onChange({ ...value, newsletterSignupLink: event.target.value })}
          fullWidth
        />
        <TextField
          label="Newsletter signup button text"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.newsletterSignupButtonText)}
          value={value.newsletterSignupButtonText}
          onChange={(event) => onChange({ ...value, newsletterSignupButtonText: event.target.value })}
          fullWidth
        />
        <TextField
          label="Newsletter RSS feed URL"
          inputRef={registerField(HOMEPAGE_SECTION_FIELD_KEYS.newsletterRssFeedUrl)}
          value={value.newsletterRssFeedUrl}
          onChange={(event) => onChange({ ...value, newsletterRssFeedUrl: event.target.value })}
          fullWidth
        />
      </AdminSectionCard>
    </Stack>
  );
}
