import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import Footer from '../layout/footer/Footer';
import ContactView from '../pages/custom/contact/ContactView';

import type { TemplatePreviewProps } from '@staticcms/core';
import type { ChurchDetails } from '../../interface';

const StyledChurchDetailsPreview = styled('div')`
  padding-top: 40px;
  background-color: #f5f4f3;
`;

const ChurchDetailsPreview = ({ entry }: TemplatePreviewProps<ChurchDetails>) => {
  const data = useMemo(() => entry.data, [entry]);

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
