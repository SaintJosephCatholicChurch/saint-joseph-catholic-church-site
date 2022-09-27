import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { FormEventHandler, useCallback, useMemo, useState } from 'react';
import { isNotEmpty } from '../../../../util/string.util';
import transientOptions from '../../../../util/transientOptions';

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

const StyledFirstRow = styled('div')`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
`;

interface AskFormBody {
  name: string;
  email: string;
  comment: string;
}

const AskForm = () => {
  const [contactFormData, setContactFormData] = useState<Partial<AskFormBody>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const valid = useMemo(() => {
    if (isNotEmpty(contactFormData.name) && isNotEmpty(contactFormData.email) && isNotEmpty(contactFormData.comment)) {
      return true;
    }

    return false;
  }, [contactFormData.comment, contactFormData.email, contactFormData.name]);

  const onChange = useCallback(
    (data: Partial<AskFormBody>) => {
      setContactFormData({ ...contactFormData, ...data });
    },
    [contactFormData]
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (!valid) {
        return;
      }

      const details = {
        'entry.587912721': contactFormData.name,
        'entry.753781836': contactFormData.email,
        'entry.1761517368': contactFormData.comment
      };

      const formBody = [];
      for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }

      try {
        await fetch(
          'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdLJbgvWisrUipyI8C6GGR9eez9xIA2-KvP-tkxfolAs7Nt1g/formResponse',
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
    },
    [contactFormData.comment, contactFormData.email, contactFormData.name, valid]
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
        Question successfully submitted!
      </StyledSubmittedMessage>
      <StyledContactForm onSubmit={onSubmit} $submitted={submitted}>
        <StyledFirstRow>
          <TextField
            name="name"
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            size="small"
            onChange={(event) => onChange({ name: event.target.value })}
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
          />
        </StyledFirstRow>
        <TextField
          name="comment"
          label="Questions"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required
          size="small"
          onChange={(event) => onChange({ comment: event.target.value })}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!valid}
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

export default AskForm;
