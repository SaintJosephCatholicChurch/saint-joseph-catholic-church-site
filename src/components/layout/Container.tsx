import { styled } from '@mui/material/styles';

import { EXTRA_EXTRA_SMALL_BREAKPOINT, MAX_APP_WIDTH } from '../../constants';
import transientOptions from '../../util/transientOptions';

import type { ReactNode } from 'react';

interface StyledContainerProps {
  $disablePadding: boolean;
}

const StyledContainer = styled(
  'div',
  transientOptions
)<StyledContainerProps>(
  ({ theme, $disablePadding }) => `
    max-width: ${MAX_APP_WIDTH}px;
    width: 100%;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    ${!$disablePadding ? 'padding: 0 24px;' : ''}

    ${theme.breakpoints.only('md')} {
      ${!$disablePadding ? 'padding: 0 32px;' : ''}
    }

    ${theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)} {
      ${!$disablePadding ? 'padding: 0 12px;' : ''}
    }
  `
);

interface ContainerProps {
  children: ReactNode;
  disablePadding?: boolean;
}

const Container = ({ children, disablePadding = false }: ContainerProps) => {
  return <StyledContainer $disablePadding={disablePadding}>{children}</StyledContainer>;
};

export default Container;
