import CopyrightIcon from '@mui/icons-material/Copyright';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import Link from 'next/link';
import { useMemo } from 'react';

import churchDetails from '../../../lib/church_details';
import getContainerQuery from '../../../util/container.util';

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

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      flex-direction: column;
      font-size: 12px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    ${getContainerQuery(theme.breakpoints.up('md'))} {
      font-size: 14px;
      height: 44px;
    }

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      gap: 4px;
    }
  `
);

const StyledCopyrightText = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: 8px;
    align-items: center;

    ${getContainerQuery(theme.breakpoints.down('sm'))} {
      flex-direction: column;
      gap: 0;
    }
  `
);

const StyledPrivacyPolicyLink = styled('div')`
  color: #fde7a5;
  cursor: pointer;

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

interface CopyrightProps {
  privacyPolicyLink: string;
}

const Copyright = ({ privacyPolicyLink }: CopyrightProps) => {
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
      <Link href={privacyPolicyLink}>
        <StyledPrivacyPolicyLink>Privacy Policy.</StyledPrivacyPolicyLink>
      </Link>
    </StyledCopyright>
  );
};

export default Copyright;
