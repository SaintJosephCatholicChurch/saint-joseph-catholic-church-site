'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { ChurchDetailsFieldKey } from './fieldKeys';
import type { ChurchDetailsDraft } from '../../content/writableStructuredContent';

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
      <TextField
        label="Contacts"
        helperText="One per line: Name | Title"
        inputRef={registerField('contacts')}
        value={value.contacts}
        onFocus={() => onFocusFieldKey('contacts')}
        onChange={(event) =>
          onChange({
            ...value,
            contacts: event.target.value
          })
        }
        fullWidth
        multiline
        minRows={4}
      />
      <Stack direction="column" spacing={2}>
        <TextField
          label="Additional emails"
          helperText="One per line: Name | Email"
          inputRef={registerField('additionalEmails')}
          value={value.additionalEmails}
          onFocus={() => onFocusFieldKey('additionalEmails')}
          onChange={(event) =>
            onChange({
              ...value,
              additionalEmails: event.target.value
            })
          }
          fullWidth
          multiline
          minRows={4}
        />
        <TextField
          label="Additional phones"
          helperText="One per line: Name | Phone"
          inputRef={registerField('additionalPhones')}
          value={value.additionalPhones}
          onFocus={() => onFocusFieldKey('additionalPhones')}
          onChange={(event) =>
            onChange({
              ...value,
              additionalPhones: event.target.value
            })
          }
          fullWidth
          multiline
          minRows={4}
        />
      </Stack>
    </Stack>
  );
}
