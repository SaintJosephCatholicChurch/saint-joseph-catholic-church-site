import { useMemo } from 'react';
import { EXTRA_SMALL_BREAKPOINT, EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../constants';
import styled from '../../util/styled.util';

const StyledHeaderPrimaryTextWrapper = styled('div')`
  display: flex;
  gap: 10px;
`;

const StyledHeaderPrimaryText = styled('h1')(
  ({ theme }) => `
    color: #ffffff;
    margin: 0;
    letter-spacing: 1.5px;
    word-spacing: 2px;
    text-transform: uppercase;
    font-size: 36px;
    line-height: 43px;

    &::first-letter {
      font-size: 43px;
    }

    ${theme.breakpoints.down(EXTRA_SMALL_BREAKPOINT)} {
      font-size: 26px;
      line-height: 36px;
  
      &::first-letter {
        font-size: 36px;
      }
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      font-size: 22px;
      line-height: 28px;
  
      &::first-letter {
        font-size: 28px;
      }
    }
  `
);

interface LogoPrimaryTextProps {
  children: string;
}

const LogoPrimaryText = ({ children }: LogoPrimaryTextProps) => {
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <StyledHeaderPrimaryTextWrapper>
      {words?.map((word) => (
        <StyledHeaderPrimaryText key={`header-primary-text-${word}`}>{word}</StyledHeaderPrimaryText>
      ))}
    </StyledHeaderPrimaryTextWrapper>
  );
};

export default LogoPrimaryText;
