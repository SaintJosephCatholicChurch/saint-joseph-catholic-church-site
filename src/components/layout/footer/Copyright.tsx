import CopyrightIcon from '@mui/icons-material/Copyright';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import { useMemo } from 'react';
import churchDetails from '../../../lib/church_details';
import styled from '../../../util/styled.util';

const StyledCopyright = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,.1);
    color: rgb(245, 244, 243);
    background-color: rgb(104, 11, 18);
    box-sizing: border-box;
    line-height: 18px;
    gap: 8px;

    ${theme.breakpoints.down('md')} {
      flex-direction: column;
      font-size: 12px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    
    ${theme.breakpoints.up('md')} {
      font-size: 14px;
      height: 44px;
    }
  `
);

const StyledCopyrightText = styled('div')`
  display: flex;
  gap: 8px;
`;

const StyledPrivacyPolicyLink = styled('a')`
  color: #988773;

  &:hover {
    color: rgb(245, 244, 243);
    text-decoration: underline;
  }
`;

const Copyright = () => {
  const year = useMemo(() => format(new Date(), 'yyyy'), []);

  return (
    <StyledCopyright>
      <StyledCopyrightText>
        <CopyrightIcon fontSize="small" />
        <Box>
          {year} {churchDetails.name}. All Rights Reserved.
        </Box>
      </StyledCopyrightText>
      <StyledPrivacyPolicyLink href="#">Privacy Policy.</StyledPrivacyPolicyLink>
    </StyledCopyright>
  );
};

export default Copyright;
