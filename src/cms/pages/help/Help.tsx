import { styled } from '@mui/material/styles';

import HelpContent from './HelpContent';
import HelpTableOfContents from './HelpTableOfContents';

const StyledWrapper = styled('div')`
  width: calc(100% - 300px);
  margin-left: 300px;
  display: flex;
  gap: 16px;
  position: absolute;
  top: 56px;
  padding-top: 24px;
  height: calc(100vh - 56px);
  overflow: hidden;
  overflow-y: auto;
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
