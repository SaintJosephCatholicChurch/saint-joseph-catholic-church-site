'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChurchOutlinedIcon from '@mui/icons-material/ChurchOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

import Help from '../cms/pages/help/Help';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthProvider';
import { BulletinMediaEditor } from './BulletinMediaEditor';
import { ComplexStructuredContentEditor } from './ComplexStructuredContentEditor';
import { DocumentContentEditor } from './DocumentContentEditor';
import { StructuredContentEditor } from './StructuredContentEditor';

import type { AdminRepoClient } from './services/adminTypes';

type AdminViewId = 'bulletins' | 'church' | 'events' | 'help' | 'homepage' | 'news' | 'pages' | 'siteConfig';

const ADMIN_PRIMARY = '#7f232c';
const ADMIN_PRIMARY_DARK = '#5c1820';
const ADMIN_GOLD = '#b88d49';
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 84;
const DESKTOP_SIDEBAR_EXPANDED_WIDTH = 272;

interface AdminView {
  id: AdminViewId;
  icon: ReactNode;
  label: string;
  requiresAuth?: boolean;
}

const ADMIN_VIEWS: AdminView[] = [
  {
    id: 'church',
    label: 'Church Details',
    icon: <ChurchOutlinedIcon fontSize="small" />
  },
  {
    id: 'homepage',
    label: 'Homepage',
    icon: <HomeOutlinedIcon fontSize="small" />
  },
  {
    id: 'bulletins',
    label: 'Bulletins',
    icon: <MenuBookOutlinedIcon fontSize="small" />
  },
  {
    id: 'news',
    label: 'News',
    icon: <NewspaperOutlinedIcon fontSize="small" />
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: <DescriptionOutlinedIcon fontSize="small" />
  },
  {
    id: 'siteConfig',
    label: 'Site Config',
    icon: <SettingsOutlinedIcon fontSize="small" />
  },
  {
    id: 'events',
    label: 'Events',
    icon: <EventOutlinedIcon fontSize="small" />,
    requiresAuth: false
  },
  {
    id: 'help',
    label: 'Help',
    icon: <HelpOutlineIcon fontSize="small" />,
    requiresAuth: false
  }
];

function parseAdminViewId(value: string | null): AdminViewId {
  return ADMIN_VIEWS.some((view) => view.id === value) ? (value as AdminViewId) : 'news';
}

const ADMIN_THEME = createTheme({
  palette: {
    primary: {
      main: ADMIN_PRIMARY,
      dark: ADMIN_PRIMARY_DARK,
      contrastText: '#ffffff'
    },
    secondary: {
      main: ADMIN_GOLD
    },
    background: {
      default: '#f4efe7',
      paper: 'rgba(255, 252, 248, 0.88)'
    },
    text: {
      primary: '#1f2022',
      secondary: '#5e6066'
    },
    divider: 'rgba(127, 35, 44, 0.12)'
  },
  shape: {
    borderRadius: 4
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Oswald', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontFamily: "'Oswald', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h3: {
      fontFamily: "'Oswald', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.015em'
    },
    h4: {
      fontFamily: "'Oswald', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.015em'
    },
    h5: {
      fontFamily: "'Oswald', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.015em'
    },
    h6: {
      fontFamily: "'Oswald', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    button: {
      fontFamily: "'Oswald', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 500,
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f4efe7',
          backgroundImage:
            'radial-gradient(circle at top left, rgba(184, 141, 73, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(127, 35, 44, 0.12), transparent 34%)',
          color: '#1f2022'
        },
        '*, *::before, *::after': {
          boxSizing: 'border-box'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6a5b4e'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 4,
          background: 'rgba(255, 250, 244, 0.96)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,244,236,0.96))'
        }
      }
    }
  }
});

const ShellRoot = styled('div')(
  () => `
    position: relative;
    isolation: isolate;
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    background:
      linear-gradient(180deg, rgba(255, 251, 247, 0.78) 0%, rgba(244, 239, 231, 0.96) 100%),
      radial-gradient(circle at top left, rgba(184, 141, 73, 0.16), transparent 28%),
      radial-gradient(circle at top right, rgba(127, 35, 44, 0.14), transparent 36%);
    color: #222222;
    overflow-x: clip;
    overflow-y: hidden;

    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: auto;
      pointer-events: none;
      z-index: -1;
    }

    &::before {
      top: -100px;
      right: -100px;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(184, 141, 73, 0.22) 0%, rgba(184, 141, 73, 0) 68%);
    }

    &::after {
      bottom: -120px;
      left: -80px;
      width: 340px;
      height: 340px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(127, 35, 44, 0.14) 0%, rgba(127, 35, 44, 0) 72%);
    }

  `
);

const ShellFrame = styled('div')(
  ({ theme }) => `
    width: 100%;
    margin: 0 auto;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;

    ${theme.breakpoints.down('md')} {
      gap: 10px;
    }
  `
);

const ShellAppBar = styled(AppBar)(
  () => `
    position: sticky;
    top: 0;
    z-index: 1100;
    background: rgba(255, 252, 248, 0.94);
    border-bottom: 1px solid rgba(127, 35, 44, 0.12);
    box-shadow: 0 4px 18px rgba(57, 33, 24, 0.08);
    backdrop-filter: blur(14px);
    color: #1f2022;
  `
);

const ShellToolbar = styled(Toolbar)(
  ({ theme }) => `
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 60px;
    padding-inline: 16px;

    ${theme.breakpoints.down('sm')} {
      min-height: 56px;
      padding-inline: 12px;
    }
  `
);

const ShellToolbarTitle = styled(Typography)`
  flex: 1;
  min-width: 0;
`;

const ShellToolbarMenuButton = styled(IconButton)(
  ({ theme }) => `
    display: none;

    ${theme.breakpoints.down('lg')} {
      display: inline-flex;
    }
  `
);

const ShellToolbarAction = styled(Button)(
  ({ theme }) => `
    ${theme.breakpoints.down('sm')} {
      min-width: 0;
      padding-inline: 14px;
    }
  `
);

const MobileSidebarDrawer = styled(Drawer)(
  ({ theme }) => `
    display: none;

    ${theme.breakpoints.down('lg')} {
      display: block;
    }

    .MuiDrawer-paper {
      width: min(320px, 88vw);
      border-radius: 4px;
      border-right: 1px solid rgba(127, 35, 44, 0.12);
      background: rgba(255, 252, 248, 0.96);
      box-shadow: 0 24px 48px rgba(57, 33, 24, 0.16);
      backdrop-filter: blur(18px);
      overflow-y: auto;
    }

    ${theme.breakpoints.down('sm')} {
      .MuiDrawer-paper {
        width: min(300px, 90vw);
      }
    }
  `
);

const ShellWorkspace = styled('div', {
  shouldForwardProp: (prop) => prop !== '$sidebarExpanded'
})<{ $sidebarExpanded: boolean }>(
  ({ $sidebarExpanded, theme }) => `
    display: grid;
    gap: 8px;
    grid-template-columns: ${$sidebarExpanded ? `${DESKTOP_SIDEBAR_EXPANDED_WIDTH}px` : `${DESKTOP_SIDEBAR_COLLAPSED_WIDTH}px`} minmax(0, 1fr);
    grid-template-rows: 1fr;
    align-items: stretch;
    min-height: 0;
    flex: 1;
    padding: 0 8px 8px 0;
    overflow: hidden;

    ${theme.breakpoints.down('lg')} {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr);
      padding-left: 8px;
    }
  `
);

const Panel = styled('section')(
  ({ theme }) => `
    border: 1px solid rgba(127, 35, 44, 0.12);
    border-radius: 4px;
    background: rgba(255, 252, 248, 0.88);
    box-shadow: 0 18px 48px rgba(57, 33, 24, 0.08);
    backdrop-filter: blur(14px);
    overflow-x: hidden;
    overflow-y: hidden;
    height: 100%;
    min-height: 0;

    ${theme.breakpoints.down('md')} {
      border-radius: 4px;
    }
  `
);

const MainPanel = styled(Panel)``;

const SidebarPanel = styled(Panel, {
  shouldForwardProp: (prop) => prop !== '$expanded'
})<{ $expanded: boolean }>(
  ({ $expanded, theme }) => `
    position: relative;
    align-self: stretch;
    max-height: none;
    overflow-x: hidden;
    overflow-y: auto;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    height: 100%;
    width: ${$expanded ? `${DESKTOP_SIDEBAR_EXPANDED_WIDTH}px` : `${DESKTOP_SIDEBAR_COLLAPSED_WIDTH}px`};

    ${theme.breakpoints.down('lg')} {
      display: none;
    }
  `
);

const SidebarPanelFrame = styled('div')(
  ({ theme }) => `
    border: 1px solid rgba(127, 35, 44, 0.12);
    border-radius: 4px;
    background: rgba(255, 252, 248, 0.88);
    box-shadow: 0 18px 48px rgba(57, 33, 24, 0.08);
    height: 100%;
    min-height: 0;
    overflow: hidden;

    ${theme.breakpoints.down('lg')} {
      display: none;
    }
  `
);

const PanelBody = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  padding: 8px;
  box-sizing: border-box;
`;

const PanelLoadingProgress = styled(LinearProgress)`
  width: calc(100% + 16px);
  margin: -8px -8px 0;
  flex-shrink: 0;
`;

const TabbedView = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;

const TabbedViewTabs = styled(Tabs)`
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgba(255, 252, 248, 0.96);
`;

const TabbedViewBody = styled('div')`
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

const SidebarBody = styled('div', {
  shouldForwardProp: (prop) => prop !== '$collapsed'
})<{ $collapsed: boolean }>(
  ({ $collapsed }) => `
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 8px 8px;
    align-items: ${$collapsed ? 'center' : 'stretch'};
  `
);

const NavigationList = styled('div')(
  () => `
  display: flex;
  flex-direction: column;
  gap: 8px;
`
);

const SidebarHeader = styled('div', {
  shouldForwardProp: (prop) => prop !== '$collapsed'
})<{ $collapsed: boolean }>(
  ({ $collapsed }) => `
    display: flex;
    align-items: center;
    justify-content: ${$collapsed ? 'center' : 'space-between'};
    gap: 8px;
    width: 100%;
    min-height: 44px;
  `
);

const NavigationButton = styled('button', {
  shouldForwardProp: (prop) => prop !== '$active' && prop !== '$collapsed'
})<{ $active: boolean; $collapsed: boolean }>(
  ({ $active, $collapsed, theme }) => `
    position: relative;
    display: flex;
    align-items: center;
    justify-content: ${$collapsed ? 'center' : 'flex-start'};
    gap: ${$collapsed ? '0' : '12px'};
    width: ${$collapsed ? '56px' : '100%'};
    min-height: 56px;
    border: 1px solid ${$active ? 'rgba(127, 35, 44, 0.22)' : 'rgba(127, 35, 44, 0.08)'};
    border-radius: 4px;
    background: ${
      $active
        ? 'linear-gradient(135deg, rgba(127, 35, 44, 0.12), rgba(184, 141, 73, 0.12))'
        : 'rgba(255, 255, 255, 0.58)'
    };
    box-shadow: ${$active ? '0 16px 28px rgba(92, 24, 32, 0.08)' : 'none'};
    color: inherit;
    cursor: pointer;
    text-align: left;
    padding: ${$collapsed ? '0' : '12px 14px 12px 18px'};
    transition: background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;

    &::before {
      content: '';
      position: absolute;
      inset: 4px auto 4px 4px;
      width: 4px;
      background: ${$active ? ADMIN_PRIMARY : 'transparent'};
    }

    &:hover {
      border-color: rgba(127, 35, 44, 0.22);
      background: ${$active ? 'linear-gradient(135deg, rgba(127, 35, 44, 0.14), rgba(184, 141, 73, 0.14))' : 'rgba(127, 35, 44, 0.05)'};
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 3px solid rgba(127, 35, 44, 0.18);
      outline-offset: 2px;
    }

    ${theme.breakpoints.down('lg')} {
      width: 100%;
      min-width: 220px;
      flex: 0 0 220px;
      scroll-snap-align: start;
      justify-content: flex-start;
      gap: 8px;
      padding: 8px 12px 8px 16px;
    }
  `
);

const NavIcon = styled('span')<{ $active: boolean }>(
  ({ $active }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: ${$active ? ADMIN_PRIMARY : '#5d4a40'};
    flex-shrink: 0;
  `
);

const NavLabel = styled('span')`
  display: block;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const DetailCard = styled('div')`
  border: 1px solid rgba(127, 35, 44, 0.12);
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(250, 245, 238, 0.92));
  padding: 18px;
`;

const LoginWorkspace = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
`;

const LoginCard = styled('section')`
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(127, 35, 44, 0.12);
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(250, 244, 236, 0.96));
  box-shadow: 0 24px 60px rgba(57, 33, 24, 0.12);
  overflow: hidden;
`;

const LoginCardBody = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 16px 20px 20px;
`;

const LoginLogo = styled('img')`
  display: block;
  height: 150px;
  max-width: 100%;
  object-fit: contain;
`;

function ChurchDetailsView({
  onSaved,
  repoClient
}: {
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient | null;
}) {
  const [tab, setTab] = useState(0);
  return (
    <TabbedView>
      <TabbedViewTabs
        allowScrollButtonsMobile
        scrollButtons="auto"
        value={tab}
        variant="scrollable"
        onChange={(_, next: number) => setTab(next)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="General Church Details" />
        <Tab label="Mass & Confession Times" />
        <Tab label="Staff" />
      </TabbedViewTabs>
      <TabbedViewBody>
        {tab === 0 ? (
          <StructuredContentEditor
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
            visibleSections={['churchDetails']}
          />
        ) : null}
        {tab === 1 ? (
          <ComplexStructuredContentEditor
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
            visibleSections={['times']}
          />
        ) : null}
        {tab === 2 ? (
          <ComplexStructuredContentEditor
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
            visibleSections={['staff']}
          />
        ) : null}
      </TabbedViewBody>
    </TabbedView>
  );
}

function SiteConfigView({ onSaved, repoClient }: { onSaved: () => Promise<void>; repoClient: AdminRepoClient | null }) {
  const [tab, setTab] = useState(0);
  return (
    <TabbedView>
      <TabbedViewTabs
        allowScrollButtonsMobile
        scrollButtons="auto"
        value={tab}
        variant="scrollable"
        onChange={(_, next: number) => setTab(next)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="General Site Config" />
        <Tab label="Menu & Logo" />
        <Tab label="Site Styles" />
      </TabbedViewTabs>
      <TabbedViewBody>
        {tab === 0 ? (
          <StructuredContentEditor
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
            visibleSections={['siteConfig']}
          />
        ) : null}
        {tab === 1 ? (
          <StructuredContentEditor
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
            visibleSections={['menu']}
          />
        ) : null}
        {tab === 2 ? (
          <StructuredContentEditor
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
            visibleSections={['styles']}
          />
        ) : null}
      </TabbedViewBody>
    </TabbedView>
  );
}

function NewsView({ onSaved, repoClient }: { onSaved: () => Promise<void>; repoClient: AdminRepoClient | null }) {
  const [tab, setTab] = useState(0);
  return (
    <TabbedView>
      <TabbedViewTabs
        value={tab}
        onChange={(_, next: number) => setTab(next)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="News Posts" />
        <Tab label="Tags" />
      </TabbedViewTabs>
      <TabbedViewBody>
        {tab === 0 ? (
          <DocumentContentEditor
            allowedKinds={['post']}
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
          />
        ) : null}
        {tab === 1 ? (
          <StructuredContentEditor
            onSaved={onSaved}
            repoClient={repoClient}
            showIntroAlert={false}
            visibleSections={['tags']}
          />
        ) : null}
      </TabbedViewBody>
    </TabbedView>
  );
}

function renderAdminView(viewId: AdminViewId, repoClient: AdminRepoClient | null, onSaved: () => Promise<void>) {
  switch (viewId) {
    case 'church':
      return <ChurchDetailsView onSaved={onSaved} repoClient={repoClient} />;
    case 'homepage':
      return (
        <ComplexStructuredContentEditor
          onSaved={onSaved}
          repoClient={repoClient}
          showIntroAlert={false}
          visibleSections={['homepage']}
        />
      );
    case 'bulletins':
      return <BulletinMediaEditor onSaved={onSaved} repoClient={repoClient} />;
    case 'news':
      return <NewsView onSaved={onSaved} repoClient={repoClient} />;
    case 'pages':
      return (
        <DocumentContentEditor
          allowedKinds={['page']}
          onSaved={onSaved}
          repoClient={repoClient}
          showIntroAlert={false}
        />
      );
    case 'siteConfig':
      return <SiteConfigView onSaved={onSaved} repoClient={repoClient} />;
    case 'events':
      return (
        <DetailCard>
          <Stack spacing={2}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
              Events (Google Calendar)
            </Typography>
            <Typography sx={{ color: '#5d4a40', lineHeight: 1.7 }}>
              The legacy admin exposed Events as a direct link to Google Calendar. That shortcut is restored here.
            </Typography>
            <Button
              color="primary"
              href="https://calendar.google.com/"
              rel="noreferrer"
              sx={{ alignSelf: 'flex-start' }}
              target="_blank"
              variant="contained"
            >
              Open Google Calendar
            </Button>
          </Stack>
        </DetailCard>
      );
    case 'help':
      return <Help />;
    default:
      return null;
  }
}

function AdminLoginPage({
  authStatus,
  error,
  login
}: {
  authStatus: ReturnType<typeof useAdminAuth>['authStatus'];
  error: string | null;
  login: () => Promise<void>;
}) {
  const isBusy = authStatus === 'restoring' || authStatus === 'authenticating';

  return (
    <LoginCard>
      <LoginCardBody>
        <LoginLogo alt="Saint Joseph Catholic Church" src="/favicon512.png" />
        {isBusy ? <LinearProgress sx={{ width: '100%' }} /> : null}
        {error ? (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        ) : null}
        <Stack
          direction={{ sm: 'row', xs: 'column' }}
          spacing={1.5}
          justifyContent="center"
          sx={{ mt: '32px', width: '100%' }}
        >
          <Button variant="contained" onClick={() => void login()} disabled={isBusy}>
            Login
          </Button>
          <Button variant="outlined" color="inherit" href="/">
            Return to site
          </Button>
        </Stack>
      </LoginCardBody>
    </LoginCard>
  );
}

function AdminShellSurface() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authStatus, error, login, logout, repoClient, session } = useAdminAuth();
  const activeViewId = parseAdminViewId(searchParams.get('view'));
  const activeView = ADMIN_VIEWS.find((view) => view.id === activeViewId) || ADMIN_VIEWS[0];
  const isAuthenticated = Boolean(session);
  const requiresAuth = activeView.requiresAuth !== false;
  const canRenderActiveView = !requiresAuth || Boolean(repoClient);
  const noopSaved = async () => {};
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const buildAdminHref = useCallback(
    (nextViewId = activeView.id) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set('view', nextViewId);

      if (nextViewId !== activeView.id) {
        nextParams.delete('entry');
      }

      nextParams.delete('mode');

      const query = nextParams.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [activeView.id, pathname, searchParams]
  );

  useEffect(() => {
    if (!searchParams.has('mode')) {
      return;
    }

    router.replace(buildAdminHref(), { scroll: false });
  }, [buildAdminHref, router, searchParams]);

  function handleSelectView(viewId: AdminViewId) {
    setMobileSidebarOpen(false);
    if (desktopSidebarExpanded) {
      setDesktopSidebarExpanded(false);
    }
    router.replace(buildAdminHref(viewId), { scroll: false });
  }

  function openMobileSidebar() {
    setMobileSidebarOpen(true);
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false);
  }

  function toggleDesktopSidebar() {
    setDesktopSidebarExpanded((current) => !current);
  }

  const collectionViews = ADMIN_VIEWS.filter((view) => view.requiresAuth !== false);
  const utilityViews = ADMIN_VIEWS.filter((view) => view.requiresAuth === false);
  const isDesktopSidebarCollapsed = !desktopSidebarExpanded;

  function renderSidebarNavigation(views: AdminView[], options: { collapsed: boolean; showTooltips: boolean }) {
    return (
      <NavigationList>
        {views.map((view) => {
          const button = (
            <NavigationButton
              key={view.id}
              type="button"
              aria-label={view.label}
              $active={view.id === activeView.id}
              $collapsed={options.collapsed}
              onClick={() => handleSelectView(view.id)}
            >
              <NavIcon $active={view.id === activeView.id}>{view.icon}</NavIcon>
              {!options.collapsed ? <NavLabel>{view.label}</NavLabel> : null}
            </NavigationButton>
          );

          return options.showTooltips ? (
            <Tooltip key={view.id} title={view.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </NavigationList>
    );
  }

  const mobileSidebarContent = (
    <SidebarBody $collapsed={false}>
      {renderSidebarNavigation(collectionViews, { collapsed: false, showTooltips: false })}
      <Divider flexItem />
      {renderSidebarNavigation(utilityViews, { collapsed: false, showTooltips: false })}
      <Divider flexItem />
      {session ? (
        <Typography sx={{ color: '#616169', fontSize: '0.9rem', lineHeight: 1.5 }}>{session.user.name}</Typography>
      ) : null}
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<LogoutOutlinedIcon />}
        onClick={() => void logout()}
        disabled={!session}
        fullWidth
      >
        Logout
      </Button>
    </SidebarBody>
  );

  const desktopSidebarContent = (
    <SidebarBody $collapsed={isDesktopSidebarCollapsed}>
      <SidebarHeader $collapsed={isDesktopSidebarCollapsed}>
        <Tooltip title={desktopSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'} placement="right">
          <IconButton
            aria-label={desktopSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={toggleDesktopSidebar}
          >
            {desktopSidebarExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Tooltip>
      </SidebarHeader>
      {renderSidebarNavigation(collectionViews, {
        collapsed: isDesktopSidebarCollapsed,
        showTooltips: isDesktopSidebarCollapsed
      })}
      <Divider flexItem />
      {renderSidebarNavigation(utilityViews, {
        collapsed: isDesktopSidebarCollapsed,
        showTooltips: isDesktopSidebarCollapsed
      })}
      <Divider flexItem />
      {isDesktopSidebarCollapsed ? (
        <Tooltip title="Logout" placement="right">
          <NavigationButton
            type="button"
            aria-label="Logout"
            $active={false}
            $collapsed
            onClick={() => void logout()}
            disabled={!session}
          >
            <NavIcon $active={false}>
              <LogoutOutlinedIcon fontSize="small" />
            </NavIcon>
          </NavigationButton>
        </Tooltip>
      ) : (
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LogoutOutlinedIcon />}
          onClick={() => void logout()}
          disabled={!session}
          fullWidth
        >
          Logout
        </Button>
      )}
    </SidebarBody>
  );

  if (!isAuthenticated) {
    return (
      <ShellRoot>
        <LoginWorkspace>
          <AdminLoginPage authStatus={authStatus} error={error} login={login} />
        </LoginWorkspace>
      </ShellRoot>
    );
  }

  return (
    <ShellRoot>
      <ShellFrame>
        <ShellAppBar position="sticky" elevation={0}>
          <ShellToolbar disableGutters>
            {isAuthenticated ? (
              <ShellToolbarMenuButton color="inherit" aria-label="Open menu" edge="start" onClick={openMobileSidebar}>
                <MenuIcon />
              </ShellToolbarMenuButton>
            ) : null}
            <ShellToolbarTitle variant="h5" sx={{ fontWeight: 700 }}>
              Content admin
            </ShellToolbarTitle>
            {session ? (
              <Typography
                sx={{
                  color: '#616169',
                  fontSize: '0.9rem',
                  flexShrink: 0,
                  display: { lg: 'block', xs: 'none' },
                  mr: 0.5
                }}
              >
                {session.user.name}
              </Typography>
            ) : null}
            <ShellToolbarAction variant="outlined" color="inherit" href="/">
              Return to site
            </ShellToolbarAction>
          </ShellToolbar>
        </ShellAppBar>

        <>
          <MobileSidebarDrawer
            anchor="left"
            open={mobileSidebarOpen}
            onClose={closeMobileSidebar}
            ModalProps={{ keepMounted: true }}
          >
            {mobileSidebarContent}
          </MobileSidebarDrawer>

          <ShellWorkspace $sidebarExpanded={desktopSidebarExpanded}>
            <SidebarPanelFrame>
              <SidebarPanel $expanded={desktopSidebarExpanded}>{desktopSidebarContent}</SidebarPanel>
            </SidebarPanelFrame>

            <MainPanel>
              <PanelBody>
                {authStatus === 'restoring' || authStatus === 'authenticating' ? <PanelLoadingProgress /> : null}
                {error ? <Alert severity="error">{error}</Alert> : null}
                {!canRenderActiveView ? <Alert severity="info">Sign in to open this collection.</Alert> : null}
                {canRenderActiveView ? renderAdminView(activeView.id, repoClient, noopSaved) : null}
              </PanelBody>
            </MainPanel>
          </ShellWorkspace>
        </>
      </ShellFrame>
    </ShellRoot>
  );
}

export default function AdminShell() {
  return (
    <ThemeProvider theme={ADMIN_THEME}>
      <CssBaseline />
      <AdminAuthProvider>
        <AdminShellSurface />
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
