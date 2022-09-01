import { ReactNode } from 'react';
import styled from '../../util/styled.util';
import Container from '../layout/Container';
import PageHeader from '../layout/header/PageHeader';
import Sidebar from '../layout/sidebar/Sidebar';

const StyledPageView = styled('article')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledPageHeader = styled('header')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface StyledPageContentsWrapperProps {
  showHeader: boolean;
}

const StyledPageContentsWrapper = styled('div', ['showHeader'])<StyledPageContentsWrapperProps>(
  ({ theme, showHeader }) => `
    width: 100%;
    ${!showHeader ? 'margin-top: 98px;' : ''}

    ${theme.breakpoints.down('md')} {
      padding-top: 0
    }

    ${theme.breakpoints.up('md')} {
      padding-top: 48px
    }
  `
);

const StyledPageContents = styled('div')(
  ({ theme }) => `
    display: grid;
    gap: 64px;
    width: 100%;
    grid-template-columns: 2fr 1fr;

    ${theme.breakpoints.down('md')} {
      grid-template-columns: 1fr;
    }
  `
);

const StyledPageBody = styled('div')`
  flex-grow: 1;
  overflow: hidden;
`;

interface PageViewProps {
  title: string;
  children: ReactNode;
  showHeader: boolean;
}

const PageView = ({ title, children, showHeader }: PageViewProps) => {
  return (
    <StyledPageView>
      {showHeader ? (
        <StyledPageHeader>
          <PageHeader title={title} />
        </StyledPageHeader>
      ) : null}
      <Container>
        <StyledPageContentsWrapper showHeader={showHeader}>
          <StyledPageContents>
            <StyledPageBody>{children}</StyledPageBody>
            <Sidebar />
          </StyledPageContents>
        </StyledPageContentsWrapper>
      </Container>
    </StyledPageView>
  );
};

export default PageView;
