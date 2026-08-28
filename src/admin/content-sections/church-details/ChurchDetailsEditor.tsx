'use client';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ChurchDetailsFieldKey } from './fieldKeys';
import type { ChurchDetailsDraft, NamedPairDraft } from '../../content/writableStructuredContent';

interface ChurchDetailsEditorProps {
  onChange: (value: ChurchDetailsDraft) => void;
  onFocusFieldKey: (fieldKey: ChurchDetailsFieldKey | null) => void;
  registerField: (fieldKey: ChurchDetailsFieldKey) => (element: HTMLElement | null) => void;
  value: ChurchDetailsDraft;
}

function NamedPairRepeater({
  addLabel,
  leftLabel,
  onChange,
  onFocus,
  registerRef,
  rightLabel,
  title,
  value
}: {
  addLabel: string;
  leftLabel: string;
  onChange: (value: NamedPairDraft[]) => void;
  onFocus: () => void;
  registerRef: (element: HTMLElement | null) => void;
  rightLabel: string;
  title: string;
  value: NamedPairDraft[];
}) {
  return (
    <Stack ref={registerRef} spacing={1.5} onFocus={onFocus}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {value.map((entry, index) => (
        <Stack key={`named-pair-${index}`} direction={{ sm: 'row', xs: 'column' }} spacing={1} alignItems={{ sm: 'center' }}>
          <TextField
            label={leftLabel}
            value={entry.name}
            onChange={(event) =>
              onChange(value.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)))
            }
            fullWidth
          />
          <TextField
            label={rightLabel}
            value={entry.value}
            onChange={(event) =>
              onChange(
                value.map((item, itemIndex) => (itemIndex === index ? { ...item, value: event.target.value } : item))
              )
            }
            fullWidth
          />
          <Button color="inherit" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} variant="outlined">
            Remove
          </Button>
        </Stack>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => onChange([...value, { name: '', value: '' }])}
        sx={{ alignSelf: 'flex-start' }}
        variant="outlined"
      >
        {addLabel}
      </Button>
    </Stack>
  );
}

interface ChurchDetailsEditorProps {
  onChange: (value: ChurchDetailsDraft) => void;
  onFocusFieldKey: (fieldKey: ChurchDetailsFieldKey | null) => void;
  registerField: (fieldKey: ChurchDetailsFieldKey) => (element: HTMLElement | null) => void;
  value: ChurchDetailsDraft;
}

export function ChurchDetailsEditor({ onChange, onFocusFieldKey, registerField, value }: ChurchDetailsEditorProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="column" spacing={2}>
        <TextField
          label="Church name"
          inputRef={registerField('name')}
          value={value.name}
          onFocus={() => onFocusFieldKey('name')}
          onChange={(event) =>
            onChange({
              ...value,
              name: event.target.value
            })
          }
          fullWidth
        />
        <TextField
          label="Main email"
          inputRef={registerField('email')}
          value={value.email}
          onFocus={() => onFocusFieldKey('email')}
          onChange={(event) =>
            onChange({
              ...value,
              email: event.target.value
            })
          }
          fullWidth
        />
        <TextField
          label="Main phone"
          inputRef={registerField('phone')}
          value={value.phone}
          onFocus={() => onFocusFieldKey('phone')}
          onChange={(event) =>
            onChange({
              ...value,
              phone: event.target.value
            })
          }
          fullWidth
        />
        <TextField
          label="Online giving URL"
          inputRef={registerField('onlineGivingUrl')}
          value={value.onlineGivingUrl}
          onFocus={() => onFocusFieldKey('onlineGivingUrl')}
          onChange={(event) =>
            onChange({
              ...value,
              onlineGivingUrl: event.target.value
            })
          }
          fullWidth
        />
        <TextField
          label="Address"
          inputRef={registerField('address')}
          value={value.address}
          onFocus={() => onFocusFieldKey('address')}
          onChange={(event) =>
            onChange({
              ...value,
              address: event.target.value
            })
          }
          fullWidth
        />
        <TextField
          label="City"
          inputRef={registerField('city')}
          value={value.city}
          onFocus={() => onFocusFieldKey('city')}
          onChange={(event) =>
            onChange({
              ...value,
              city: event.target.value
            })
          }
          fullWidth
        />
      </Stack>
      <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
        <TextField
          label="State"
          inputRef={registerField('state')}
          value={value.state}
          onFocus={() => onFocusFieldKey('state')}
          onChange={(event) =>
            onChange({
              ...value,
              state: event.target.value
            })
          }
          fullWidth
        />
        <TextField
          label="Zip code"
          inputRef={registerField('zipcode')}
          value={value.zipcode}
          onFocus={() => onFocusFieldKey('zipcode')}
          onChange={(event) =>
            onChange({
              ...value,
              zipcode: event.target.value
            })
          }
          fullWidth
        />
      </Stack>
      <TextField
        label="Facebook page"
        inputRef={registerField('facebookPage')}
        value={value.facebookPage}
        onFocus={() => onFocusFieldKey('facebookPage')}
        onChange={(event) =>
          onChange({
            ...value,
            facebookPage: event.target.value
          })
        }
        fullWidth
      />
      <TextField
        label="Google map URL"
        inputRef={registerField('googleMapLocation')}
        value={value.googleMapLocation}
        onFocus={() => onFocusFieldKey('googleMapLocation')}
        onChange={(event) =>
          onChange({
            ...value,
            googleMapLocation: event.target.value
          })
        }
        fullWidth
      />
      <TextField
        label="Mission statement"
        inputRef={registerField('missionStatement')}
        value={value.missionStatement}
        onFocus={() => onFocusFieldKey('missionStatement')}
        onChange={(event) =>
          onChange({
            ...value,
            missionStatement: event.target.value
          })
        }
        fullWidth
        multiline
        minRows={3}
      />
      <TextField
        label="Vision statement"
        inputRef={registerField('visionStatement')}
        value={value.visionStatement}
        onFocus={() => onFocusFieldKey('visionStatement')}
        onChange={(event) =>
          onChange({
            ...value,
            visionStatement: event.target.value
          })
        }
        fullWidth
        multiline
        minRows={3}
      />
      <NamedPairRepeater
        addLabel="Add contact"
        leftLabel="Name"
        onChange={(contacts) => onChange({ ...value, contacts })}
        onFocus={() => onFocusFieldKey('contacts')}
        registerRef={registerField('contacts')}
        rightLabel="Title"
        title="Contacts"
        value={value.contacts}
      />
      <Stack direction="column" spacing={2}>
        <NamedPairRepeater
          addLabel="Add email"
          leftLabel="Name"
          onChange={(additionalEmails) => onChange({ ...value, additionalEmails })}
          onFocus={() => onFocusFieldKey('additionalEmails')}
          registerRef={registerField('additionalEmails')}
          rightLabel="Email"
          title="Additional emails"
          value={value.additionalEmails}
        />
        <NamedPairRepeater
          addLabel="Add phone"
          leftLabel="Name"
          onChange={(additionalPhones) => onChange({ ...value, additionalPhones })}
          onFocus={() => onFocusFieldKey('additionalPhones')}
          registerRef={registerField('additionalPhones')}
          rightLabel="Phone"
          title="Additional phones"
          value={value.additionalPhones}
        />
      </Stack>
    </Stack>
  );
}
