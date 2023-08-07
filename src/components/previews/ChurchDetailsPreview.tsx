import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import Footer from '../layout/footer/Footer';
import ContactView from '../pages/custom/contact/ContactView';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { ChurchDetails } from '../../interface';

const StyledChurchDetailsPreview = styled('div')`
  container: page / inline-size;
  font-family: Open Sans,Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  background-color: #f5f4f3;
  color: #222;
  font-weight: 200;
  font-size: 16px;
  padding-top: 40px;
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
