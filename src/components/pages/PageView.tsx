import { ReactNode } from 'react';
import styled from '../../util/styled.util';
import Container from '../layout/Container';
import Sidebar from '../layout/sidebar/Sidebar';
import PageTitle from './PageTitle';

const StyledPageView = styled('article')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledPageHeaderWrapper = styled('header')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
`;

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
  showSidebar: boolean;
}

const StyledPageContents = styled('div', ['showSidebar'])<StyledPageContentsProps>(
  ({ theme, showSidebar }) => `
    display: grid;
    gap: 64px;
    width: 100%;
    grid-template-columns: ${showSidebar ? '2fr 1fr' : '1fr'};

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
  showSidebar: boolean;
}

const PageView = ({ title, children, showHeader, showSidebar }: PageViewProps) => {
  return (
    <StyledPageView>
      <Container>
        <StyledPageContentsWrapper>
          <StyledPageContents>
            <StyledPageBody>
              {showHeader ? (
                <StyledPageHeaderWrapper>
                  <PageTitle title={title} />
                </StyledPageHeaderWrapper>
              ) : null}
              {children}
            </StyledPageBody>
            {showSidebar ? <Sidebar /> : null}
          </StyledPageContents>
        </StyledPageContentsWrapper>
      </Container>
    </StyledPageView>
  );
};

export default PageView;
