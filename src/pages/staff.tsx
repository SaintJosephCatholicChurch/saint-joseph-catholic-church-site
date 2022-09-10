import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PageLayout from '../components/PageLayout';
import { getRecentPostsStaticProps, RecentPostsProps } from '../lib/posts';
import staff from '../lib/staff';
import styled from '../util/styled.util';

const DEFAULT_CARD_SIZE = 225;
const CARD_GAP_SIZE = 24;
const GLOBAL_PADDING = 48;

const StyledStaffWrapper = styled('div')`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${CARD_GAP_SIZE}px;
  width: 100%;
`;

type StaffProps = RecentPostsProps;

const Staff = ({ recentPosts }: StaffProps) => {
  const theme = useTheme();

  const customBreakpoint = DEFAULT_CARD_SIZE * 2 + CARD_GAP_SIZE + GLOBAL_PADDING;

  return (
    <PageLayout url="/staff" title="Parish Staff" recentPosts={recentPosts}>
      <StyledStaffWrapper>
        {staff.map((staffMember, index) => (
          <Card
            key={`staff-${index}`}
            sx={{
              width: DEFAULT_CARD_SIZE,
              [theme.breakpoints.down(customBreakpoint)]: {
                width: '100%'
              }
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: DEFAULT_CARD_SIZE,
                [theme.breakpoints.down(customBreakpoint)]: {
                  height: '80vw'
                }
              }}
              image={staffMember.picture}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {staffMember.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {staffMember.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </StyledStaffWrapper>
    </PageLayout>
  );
};

export default Staff;

export const getStaticProps = getRecentPostsStaticProps;
