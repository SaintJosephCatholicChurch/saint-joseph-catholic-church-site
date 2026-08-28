'use client';

import { styled } from '@mui/material/styles';
import { useRef } from 'react';

import HelpContent from './HelpContent';
import HelpTableOfContents from './HelpTableOfContents';

const StyledOuterWrapper = styled('section')`
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  box-sizing: border-box;
`;

const StyledIntro = styled('div')`
  flex-shrink: 0;
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
  flex-shrink: 0;
  display: grid;
  gap: 20px;
  align-items: stretch;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 300px);

  ${theme.breakpoints.down('lg')} {
    grid-template-columns: 1fr;
  }
`
);

const StyledTocColumn = styled('div')(
  ({ theme }) => `
  min-width: 0;

  ${theme.breakpoints.down('lg')} {
    order: -1;
  }
`
);

const Help = () => {
  const scrollRootRef = useRef<HTMLElement | null>(null);

  return (
    <StyledOuterWrapper id="cms-help-scroll" ref={scrollRootRef}>
      <StyledIntro>
        <p>
          This guide explains what each admin section controls on the live site. Use the table of contents to jump
          between collections and workflow notes without leaving the admin.
        </p>
      </StyledIntro>
      <StyledWrapper>
        <HelpContent />
        <StyledTocColumn>
          <HelpTableOfContents scrollRootRef={scrollRootRef} />
        </StyledTocColumn>
      </StyledWrapper>
    </StyledOuterWrapper>
  );
};

export default Help;