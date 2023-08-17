import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import { EXTRA_EXTRA_SMALL_BREAKPOINT, LARGE_BREAKPOINT } from '../../constants';
import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';

const StyledHeaderSecondaryTextWrapper = styled('div')`
  display: flex;
  gap: 8px;
`;

interface StyledHeaderSecondaryTextProps {
  $inCMS: boolean;
}

const StyledHeaderSecondaryText = styled(
  'h2',
  transientOptions
)<StyledHeaderSecondaryTextProps>(
  ({ theme, $inCMS }) => `
    color: #ffffff;
    margin: 0;
    letter-spacing: 0.75px;
    text-transform: uppercase;
    font-size: 18px;
    line-height: 22px;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;
    font-weight: bold;

    &::first-letter {
      font-size: 22px;
    }

    ${getContainerQuery(theme.breakpoints.down(LARGE_BREAKPOINT), $inCMS)} {
      font-size: 13px;
      line-height: 18px;

      &::first-letter {
        font-size: 17px;
      }
    }

    ${getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT), $inCMS)} {
      font-size: 11px;
      line-height: 14px;

      &::first-letter {
        font-size: 14px;
      }
    }
  `
);

interface LogoSecondaryTextProps {
  children: string;
  inCMS: boolean;
}

const LogoSecondaryText = ({ children, inCMS }: LogoSecondaryTextProps) => {
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <StyledHeaderSecondaryTextWrapper>
      {words?.map((word) => (
        <StyledHeaderSecondaryText key={`header-primary-text-${word}`} $inCMS={inCMS}>
          {word}
        </StyledHeaderSecondaryText>
      ))}
    </StyledHeaderSecondaryTextWrapper>
  );
};

export default LogoSecondaryText;
