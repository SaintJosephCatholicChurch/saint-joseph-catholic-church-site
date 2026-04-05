import { styled } from '@mui/material/styles';

import contentStyles from '../../../../../public/styles/content.module.css';
import ParishRegistrationForm from './ParishRegistrationForm';

const StyledDetails = styled('div')`
  margin-bottom: 32px;
`;

const ParishRegistrationView = () => {
  return (
    <>
      <StyledDetails className={contentStyles.content}>
        <p>Please complete the parish registration form below.</p>
        <p>The submitted form will be emailed to the parish office.</p>
      </StyledDetails>
      <ParishRegistrationForm />
    </>
  );
};

export default ParishRegistrationView;
