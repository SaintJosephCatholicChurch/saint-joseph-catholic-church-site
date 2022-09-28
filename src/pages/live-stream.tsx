import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import PageLayout from '../components/PageLayout';
import LiveStreamView from '../components/pages/custom/live-stream/LiveStreamView';
import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../constants';
import { getSidebarStaticProps, SidebarProps } from '../lib/sidebar';

const StyledLiveStreamPageContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type LiveStreamProps = SidebarProps;

const LiveStream = ({ ...sidebarProps }: LiveStreamProps) => {
  const theme = useTheme();

  return (
    <PageLayout url="/live-stream" title="Live Stream" {...sidebarProps}>
      <StyledLiveStreamPageContent>
        <LiveStreamView />
        <Button
          variant="contained"
          size="large"
          startIcon={<FacebookIcon />}
          href="https://www.facebook.com/stjosephchurchbluffton/live"
          target="_blank"
          sx={{
            marginTop: '16px',
            fontSize: '20px',
            backgroundColor: '#bc2f3b',
            '&:hover': {
              backgroundColor: '#d24c57',
              color: '#ffffff'
            },
            '.MuiButton-startIcon > *:nth-of-type(1)': {
              fontSize: '24px'
            },
            [theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT)]: {
              fontSize: '16px',
              '.MuiButton-startIcon > *:nth-of-type(1)': {
                fontSize: '20px'
              }
            }
          }}
        >
          View past streams
        </Button>
      </StyledLiveStreamPageContent>
    </PageLayout>
  );
};

export default LiveStream;

export const getStaticProps = getSidebarStaticProps;
