import { styled } from '@mui/material/styles';
import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import type { ChurchDetails } from '../../interface';
import Footer from '../layout/footer/Footer';
import ContactView from '../pages/custom/contact/ContactView';

const StyledChurchDetailsPreview = styled('div')`
  padding-top: 40px;
  background-color: #f5f4f3;
`;

const ChurchDetailsPreview = ({ entry }: PreviewTemplateComponentProps) => {
  const data = useMemo(() => entry.toJS().data as ChurchDetails, [entry]);

  return useMemo(
    () => (
      <StyledChurchDetailsPreview>
        <ContactView churchDetails={data} disableForm />
        <Footer churchDetails={data} privacyPolicyLink="#" />
      </StyledChurchDetailsPreview>
    ),
    [data]
  );
};

export default ChurchDetailsPreview;
