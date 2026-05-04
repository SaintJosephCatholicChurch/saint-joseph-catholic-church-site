import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useCallback, useState } from 'react';

import { CONTACT_URL } from '../../../../constants';
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
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    const submitForm = async () => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = `${formData.get('name') ?? ''}`.trim();
      const email = `${formData.get('email') ?? ''}`.trim();
      const subject = `${formData.get('subject') ?? 'Comment / Question'}`.trim();
      const comment = `${formData.get('comment') ?? ''}`.trim();

      if (!name || !email || !comment) {
        return;
      }

      setInProgress(true);

      try {
        await fetch(CONTACT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            comment
          })
        });
      } catch (error) {
        console.error('There was an error', error);
        setInProgress(false);
        return;
      }

      setSubmitted(true);
    };

    submitForm();
  }, []);

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
          disabled={disableForm || inProgress}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          size="small"
          disabled={disableForm || inProgress}
        />
        <FormControl fullWidth required size="small" disabled={disableForm || inProgress}>
          <InputLabel id="subject-select-label">Subject</InputLabel>
          <Select
            name="subject"
            labelId="subject-select-label"
            id="subject-select"
            label="Subject"
            defaultValue="Comment / Question"
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
          disabled={disableForm || inProgress}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={disableForm || inProgress}
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
