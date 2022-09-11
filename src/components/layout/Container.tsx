import { ReactNode } from 'react';
import { MAX_APP_WIDTH } from '../../constants';
import styled from '../../util/styled.util';

interface StyledContainerProps {
  disablePadding: boolean;
}

const StyledContainer = styled('div', ['disablePadding'])<StyledContainerProps>(
  ({ theme, disablePadding }) => `
    max-width: ${MAX_APP_WIDTH}px;
    width: 100%;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    ${!disablePadding ? 'padding: 0 24px;' : ''}

    ${theme.breakpoints.only('md')} {
      ${!disablePadding ? 'padding: 0 32px;' : ''}
    }
  `
);

interface ContainerProps {
  children: ReactNode;
  disablePadding?: boolean;
}

const Container = ({ children, disablePadding = false }: ContainerProps) => {
  return <StyledContainer disablePadding={disablePadding}>{children}</StyledContainer>;
};

export default Container;
