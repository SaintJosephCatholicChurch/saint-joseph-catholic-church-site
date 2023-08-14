import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';
import Container from '../layout/Container';
import Sidebar from '../layout/sidebar/Sidebar';
import PageTitle from './PageTitle';

import type { ReactNode } from 'react';
import type { DailyReadings, PostContent } from '../../interface';

interface StyledPageViewProps {
  $disableMargin: boolean;
}

const StyledPageView = styled(
  'article',
  transientOptions
)<StyledPageViewProps>(
  ({ $disableMargin }) => `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    flex-grow: 1;
    ${!$disableMargin ? 'margin-bottom: 48px;' : ''}
  `
);

const StyledPageContentsWrapper = styled('div')(
  ({ theme }) => `
    width: 100%;
    margin-top: 98px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      padding-top: 0
    }

    ${getContainerQuery(theme.breakpoints.up('md'))} {
      padding-top: 48px
    }
  `
);

interface StyledPageContentsProps {
  $hideSidebar: boolean;
}

const StyledPageContents = styled(
  'div',
  transientOptions
)<StyledPageContentsProps>(
  ({ theme, $hideSidebar }) => `
    display: grid;
    gap: 64px;
    width: 100%;
    grid-template-columns: ${$hideSidebar ? 'minmax(0, 1fr)' : 'minmax(0, 2fr) minmax(0, 1fr)'};

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      gap: 24px;
    }

    ${getContainerQuery(theme.breakpoints.down('md'))} {
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
  recentPosts?: PostContent[];
  dailyReadings?: DailyReadings;
  hideSidebar?: boolean;
  hideSearch?: boolean;
  disableBottomMargin?: boolean;
  disablePadding?: boolean;
  fullWidth?: boolean;
}

const PageView = ({
  title,
  children,
  recentPosts,
  dailyReadings,
  hideHeader = false,
  hideSidebar = false,
  hideSearch,
  disableBottomMargin = false,
  disablePadding = false,
  fullWidth = false
}: PageViewProps) => {
  const contents = useMemo(
    () => (
      <StyledPageContentsWrapper>
        <StyledPageContents $hideSidebar={hideSidebar}>
          <StyledPageBody>
            {!hideHeader ? <PageTitle title={title} /> : null}
            {children}
          </StyledPageBody>
          {!hideSidebar ? (
            <Sidebar hideSearch={hideSearch} dailyReadings={dailyReadings} recentPosts={recentPosts} />
          ) : null}
        </StyledPageContents>
      </StyledPageContentsWrapper>
    ),
    [children, dailyReadings, hideHeader, hideSearch, hideSidebar, recentPosts, title]
  );

  return (
    <StyledPageView $disableMargin={disableBottomMargin}>
      {fullWidth ? contents : <Container disablePadding={disablePadding}>{contents}</Container>}
    </StyledPageView>
  );
};

export default PageView;
