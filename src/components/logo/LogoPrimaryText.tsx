import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import { EXTRA_EXTRA_SMALL_BREAKPOINT, EXTRA_SMALL_BREAKPOINT, LARGE_BREAKPOINT, SMALL_BREAKPOINT } from '../../constants';
import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';

const StyledHeaderPrimaryTextWrapper = styled('div')`
  display: flex;
  gap: 10px;
`;

interface StyledHeaderPrimaryTextProps {
  $inCMS: boolean;
}

const StyledHeaderPrimaryText = styled('h1', transientOptions)<StyledHeaderPrimaryTextProps>(
  ({ theme, $inCMS }) => `
    color: #ffffff;
    margin: 0;
    letter-spacing: 1.5px;
    word-spacing: 2px;
    text-transform: uppercase;
    font-size: 36px;
    line-height: 43px;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;
    font-weight: bold;

    &::first-letter {
      font-size: 43px;
    }

    ${getContainerQuery(theme.breakpoints.down(LARGE_BREAKPOINT), $inCMS)} {
      font-size: 24px;
      line-height: 32px;

      &::first-letter {
        font-size: 30px;
      }
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT), $inCMS)} {
      font-size: 20px;
      line-height: 26px;

      &::first-letter {
        font-size: 26px;
      }
    }
  `
);

interface LogoPrimaryTextProps {
  children: string;
  inCMS: boolean;
}

const LogoPrimaryText = ({ children, inCMS }: LogoPrimaryTextProps) => {
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <StyledHeaderPrimaryTextWrapper>
      {words?.map((word) => (
        <StyledHeaderPrimaryText key={`header-primary-text-${word}`} $inCMS={inCMS}>{word}</StyledHeaderPrimaryText>
      ))}
    </StyledHeaderPrimaryTextWrapper>
  );
};

export default LogoPrimaryText;
