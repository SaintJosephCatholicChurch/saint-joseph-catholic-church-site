import { styled } from '@mui/material/styles';

import HelpContent from './HelpContent';
import HelpTableOfContents from './HelpTableOfContents';

const StyledOuterWrapper = styled('section')`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledIntro = styled('div')`
  border: 1px solid rgba(127, 35, 44, 0.12);
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(248, 241, 232, 0.96));
  padding: 20px 22px;

  p {
    margin: 0;
    color: #5e6066;
    line-height: 1.7;
    font-size: 0.98rem;
  }
`;

const StyledWrapper = styled('div')(
  ({ theme }) => `
  width: 100%;
  display: grid;
  gap: 20px;
  align-items: start;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 300px);

  ${theme.breakpoints.down('lg')} {
    grid-template-columns: 1fr;
  }
`
);

const Help = () => {
  return (
    <StyledOuterWrapper>
      <StyledIntro>
        <p>
          This guide explains what each admin section controls on the live site. Use the table of contents to jump
          between collections and workflow notes without leaving the admin.
        </p>
      </StyledIntro>
      <StyledWrapper>
        <HelpContent />
        <HelpTableOfContents />
      </StyledWrapper>
    </StyledOuterWrapper>
  );
};

export default Help;