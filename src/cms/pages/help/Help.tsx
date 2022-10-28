import { styled } from '@mui/material/styles';
import HelpContent from './HelpContent';
import HelpTableOfContents from './HelpTableOfContents';

const StyledWrapper = styled('div')`
  width: calc(100% - 280px);
  margin-left: 280px;
  display: flex;
  gap: 16px;
`;

const Help = () => {
  return (
    <StyledWrapper>
      <HelpContent />
      <HelpTableOfContents />
    </StyledWrapper>
  );
};

export default Help;
