'use client';

import TextField from '@mui/material/TextField';

import type { TagsDraft } from '../../content/writableStructuredContent';

interface TagsEditorProps {
  onChange: (value: TagsDraft) => void;
  value: TagsDraft;
}

export function TagsEditor({ onChange, value }: TagsEditorProps) {
  return (
    <TextField
      label="Tags"
      helperText="Separate tags with commas or line breaks."
      value={value.tags}
      onChange={(event) =>
        onChange({
          tags: event.target.value
        })
      }
      fullWidth
      multiline
      minRows={4}
    />
  );
}
