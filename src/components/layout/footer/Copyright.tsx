import CopyrightIcon from '@mui/icons-material/Copyright';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import format from 'date-fns/format';
import { useMemo } from 'react';
import churchDetails from '../../../lib/church_details';

const StyledCopyright = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,.1);
    color: rgb(245, 244, 243);
    background-color: #bc2f3b;
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

    ${theme.breakpoints.down('sm')} {
      gap: 4px;
    }
  `
);

const StyledCopyrightText = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 8px;
    align-items: center;

    ${theme.breakpoints.down('sm')} {
      flex-direction: column;
      gap: 0;
    }
  `
);

const StyledPrivacyPolicyLink = styled('a')`
  color: #fde7a5;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const StyledCopyrightSection = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Copyright = () => {
  const year = useMemo(() => format(new Date(), 'yyyy'), []);

  return (
    <StyledCopyright>
      <StyledCopyrightText>
        <StyledCopyrightSection>
          <CopyrightIcon fontSize="small" />
          <Box>
            {year} {churchDetails.name}.
          </Box>
        </StyledCopyrightSection>
        <StyledCopyrightSection>
          <Box>All Rights Reserved.</Box>
        </StyledCopyrightSection>
      </StyledCopyrightText>
      <StyledPrivacyPolicyLink href="#">Privacy Policy.</StyledPrivacyPolicyLink>
    </StyledCopyright>
  );
};

export default Copyright;
