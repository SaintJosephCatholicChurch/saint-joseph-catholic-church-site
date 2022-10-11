import { styled } from '@mui/material/styles';
import HelpContent from './HelpContent';
import HelpTableOfContents from './HelpTableOfContents';

const StyledWrapper = styled('div')`
  width: calc(100% - 270px);
  margin-left: 270px;
  display: flex;
  max-width: 800px;
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
