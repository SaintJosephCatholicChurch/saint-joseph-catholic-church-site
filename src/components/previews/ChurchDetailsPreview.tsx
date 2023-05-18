import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import Footer from '../layout/footer/Footer';
import ContactView from '../pages/custom/contact/ContactView';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { ChurchDetails } from '../../interface';

const StyledChurchDetailsPreview = styled('div')`
  padding-top: 40px;
  background-color: #f5f4f3;
`;

const ChurchDetailsPreview: TemplatePreviewComponent<ChurchDetails> = ({ entry }) => {
  return useMemo(
    () => (
      <StyledChurchDetailsPreview>
        <ContactView churchDetails={entry.data} disableForm />
        <Footer churchDetails={entry.data} privacyPolicyLink="#" hideSearch />
      </StyledChurchDetailsPreview>
    ),
    [entry.data]
  );
};

export default ChurchDetailsPreview;
