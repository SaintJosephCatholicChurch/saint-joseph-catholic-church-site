import { ReactNode, useMemo } from 'react';
import styled from '../../util/styled.util';
import Container from '../layout/Container';
import Sidebar from '../layout/sidebar/Sidebar';
import PageTitle from './PageTitle';

interface StyledPageViewProps {
  disableMargin: boolean;
}

const StyledPageView = styled('article', ['disableMargin'])<StyledPageViewProps>(
  ({ disableMargin }) => `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    flex-grow: 1;
    ${!disableMargin ? 'margin-bottom: 48px;' : ''}
  `
);

const StyledPageContentsWrapper = styled('div')(
  ({ theme }) => `
    width: 100%;
    margin-top: 98px;

    ${theme.breakpoints.down('md')} {
      padding-top: 0
    }

    ${theme.breakpoints.up('md')} {
      padding-top: 48px
    }
  `
);

interface StyledPageContentsProps {
  hideSidebar: boolean;
}

const StyledPageContents = styled('div', ['hideSidebar'])<StyledPageContentsProps>(
  ({ theme, hideSidebar }) => `
    display: grid;
    gap: 64px;
    width: 100%;
    grid-template-columns: ${hideSidebar ? '1fr' : '2fr 1fr'};

    ${theme.breakpoints.down('md')} {
      grid-template-columns: 1fr;
    }
  `
);

const StyledPageBody = styled('div')`
  flex-grow: 1;
`;

interface PageViewProps {
  title: string;
  children: ReactNode;
  hideHeader: boolean;
  hideSidebar?: boolean;
  disableTitleMargin?: boolean;
  disableBottomMargin?: boolean;
  disablePadding?: boolean;
  fullWidth?: boolean;
}

const PageView = ({
  title,
  children,
  hideHeader = false,
  hideSidebar = false,
  disableTitleMargin = false,
  disableBottomMargin = false,
  disablePadding = false,
  fullWidth = false
}: PageViewProps) => {
  const contents = useMemo(
    () => (
      <StyledPageContentsWrapper>
        <StyledPageContents hideSidebar={hideSidebar}>
          <StyledPageBody>
            {!hideHeader ? <PageTitle title={title} disableMargin={disableTitleMargin} /> : null}
            {children}
          </StyledPageBody>
          {!hideSidebar ? <Sidebar /> : null}
        </StyledPageContents>
      </StyledPageContentsWrapper>
    ),
    [children, disableTitleMargin, hideHeader, hideSidebar, title]
  );

  return (
    <StyledPageView disableMargin={disableBottomMargin}>
      {fullWidth ? contents : <Container disablePadding={disablePadding}>{contents}</Container>}
    </StyledPageView>
  );
};

export default PageView;
