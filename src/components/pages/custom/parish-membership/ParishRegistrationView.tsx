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
        <p>
          Please complete the parish registration form below so our parish office can receive your household information
          directly.
        </p>
        <p>The submitted form will be emailed to the parish office and a PDF copy will be generated for office use.</p>
      </StyledDetails>
      <ParishRegistrationForm />
    </>
  );
};

export default ParishRegistrationView;
