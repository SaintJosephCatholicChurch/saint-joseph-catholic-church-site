import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import { EXTRA_EXTRA_SMALL_BREAKPOINT, EXTRA_SMALL_BREAKPOINT } from '../../constants';

const StyledHeaderSecondaryTextWrapper = styled('div')`
  display: flex;
  gap: 8px;
`;

const StyledHeaderSecondaryText = styled('h3')(
  ({ theme }) => `
    color: #ffffff;
    margin: 0;
    letter-spacing: 0.75px;
    text-transform: uppercase;
    font-size: 18px;
    line-height: 22px;

    &::first-letter {
      font-size: 22px;
    }

    ${theme.breakpoints.down(EXTRA_SMALL_BREAKPOINT)} {
      font-size: 16px;
      line-height: 19px;
    
      &::first-letter {
        font-size: 19px;
      }
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      font-size: 14px;
      line-height: 16px;
    
      &::first-letter {
        font-size: 16px;
      }
    }
  `
);

interface LogoSecondaryTextProps {
  children: string;
}

const LogoSecondaryText = ({ children }: LogoSecondaryTextProps) => {
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <StyledHeaderSecondaryTextWrapper>
      {words?.map((word) => (
        <StyledHeaderSecondaryText key={`header-primary-text-${word}`}>{word}</StyledHeaderSecondaryText>
      ))}
    </StyledHeaderSecondaryTextWrapper>
  );
};

export default LogoSecondaryText;
