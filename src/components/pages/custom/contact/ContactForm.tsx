import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useCallback, useMemo, useState } from 'react';

import { isNotEmpty } from '../../../../util/string.util';
import transientOptions from '../../../../util/transientOptions';

import type { FormEventHandler } from 'react';

const StyledCommentFormWrapper = styled('div')`
  position: relative;
  display: flex;
  width: 100%;
`;

interface StyledContactFormProps {
  $submitted: boolean;
}

const StyledContactForm = styled(
  'form',
  transientOptions
)<StyledContactFormProps>(
  ({ $submitted }) => `
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;

    ${
      $submitted
        ? `
          opacity: 0.3;
          pointer-events: none;
        `
        : ''
    }
  `
);

interface StyledSubmittedMessageProps {
  $submitted: boolean;
}

const StyledSubmittedMessage = styled(
  'h3',
  transientOptions
)<StyledSubmittedMessageProps>(
  ({ $submitted }) => `
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 24px;

    ${
      !$submitted
        ? `
          visibility: hidden;
          height: 0;
          width: 0;
        `
        : ''
    }
  `
);

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  comment: string;
}

interface ContactFormProps {
  disableForm?: boolean;
}

const ContactForm = ({ disableForm = false }: ContactFormProps) => {
  const [contactFormData, setContactFormData] = useState<Partial<ContactBody>>({ subject: 'Comment / Question' });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const valid = useMemo(() => {
    if (isNotEmpty(contactFormData.name) && isNotEmpty(contactFormData.email) && isNotEmpty(contactFormData.comment)) {
      return true;
    }

    return false;
  }, [contactFormData.comment, contactFormData.email, contactFormData.name]);

  const onChange = useCallback(
    (data: Partial<ContactBody>) => {
      setContactFormData({ ...contactFormData, ...data });
    },
    [contactFormData]
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      const submitForm = async () => {
        event.preventDefault();
        if (!valid) {
          return;
        }

        const details = {
          'entry.1684511342': contactFormData.name,
          'entry.1405174963': contactFormData.email,
          'entry.1496222327': contactFormData.subject,
          'entry.1923336410': contactFormData.comment
        };

        const formBody = [];
        for (const property in details) {
          const encodedKey = encodeURIComponent(property);
          const encodedValue = encodeURIComponent(details[property as keyof typeof details]);
          formBody.push(encodedKey + '=' + encodedValue);
        }

        try {
          await fetch(
            'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeD0sH95rRB3Wld-gstqjV6FJfAa5W6y1RuDBWbuJO0BLEoxg/formResponse',
            {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              body: formBody.join('&')
            }
          );
        } catch (error) {
          console.error('There was an error', error);
        }

        setSubmitted(true);
      };

      submitForm();
    },
    [contactFormData.comment, contactFormData.email, contactFormData.name, contactFormData.subject, valid]
  );

  return (
    <StyledCommentFormWrapper>
      <StyledSubmittedMessage $submitted={submitted}>
        <CheckCircleIcon
          color="success"
          sx={{
            fontSize: '72px'
          }}
        />
        Message successfully submitted!
      </StyledSubmittedMessage>
      <StyledContactForm onSubmit={onSubmit} $submitted={submitted}>
        <TextField
          name="name"
          label="Full Name"
          variant="outlined"
          fullWidth
          required
          size="small"
          onChange={(event) => onChange({ name: event.target.value })}
          disabled={disableForm}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          size="small"
          onChange={(event) => onChange({ email: event.target.value })}
          disabled={disableForm}
        />
        <FormControl fullWidth required size="small" disabled={disableForm}>
          <InputLabel id="subject-select-label">Subject</InputLabel>
          <Select
            name="subject"
            labelId="subject-select-label"
            id="subject-select"
            label="Subject"
            defaultValue="Comment / Question"
            onChange={(event) => onChange({ subject: event.target.value })}
          >
            <MenuItem value="Comment / Question">Comment / Question</MenuItem>
            <MenuItem value="Prayer Request">Prayer Request</MenuItem>
            <MenuItem value="Prayer Chain">Prayer Chain</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="comment"
          label="Comments / Questions"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required
          size="small"
          onChange={(event) => onChange({ comment: event.target.value })}
          disabled={disableForm}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={disableForm || !valid}
          sx={{
            width: '150px',
            backgroundColor: '#bf303c',
            '&:hover': {
              backgroundColor: '#822129',
              color: '#ccc'
            }
          }}
        >
          Send Message
        </Button>
      </StyledContactForm>
    </StyledCommentFormWrapper>
  );
};

export default ContactForm;
