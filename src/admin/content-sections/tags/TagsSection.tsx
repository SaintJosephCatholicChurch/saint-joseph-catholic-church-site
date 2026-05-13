'use client';

import Typography from '@mui/material/Typography';

import { AdminContentSectionPage } from '../components/AdminContentSectionPage';
import { TagsEditor } from './TagsEditor';

import type { TagsDraft } from '../../content/writableStructuredContent';
import type { ReactNode } from 'react';

interface TagsSectionProps {
  headerActions: ReactNode;
  onChange: (value: TagsDraft) => void;
  value: TagsDraft;
}

export function TagsSection({ headerActions, onChange, value }: TagsSectionProps) {
  return (
    <AdminContentSectionPage
      actions={headerActions}
      title="Tags"
      description={
        <Typography sx={{ color: '#616169', lineHeight: 1.7 }}>
          Shared taxonomy terms from content/meta/tags.json. Enter one tag per line or separate them with commas.
        </Typography>
      }
      editor={<TagsEditor value={value} onChange={onChange} />}
    />
  );
}
