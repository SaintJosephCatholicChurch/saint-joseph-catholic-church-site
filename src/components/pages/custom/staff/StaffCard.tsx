import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { STAFF_CARD_GAP_SIZE, STAFF_DEFAULT_CARD_SIZE, STAFF_GLOBAL_PADDING } from '../../../../constants';
import getContainerQuery from '../../../../util/container.util';

import type { Staff } from '../../../../interface';

interface StaffCardProps {
  staffMember: Staff;
}

const StaffCard = ({ staffMember }: StaffCardProps) => {
  const theme = useTheme();

  const customBreakpoint = STAFF_DEFAULT_CARD_SIZE * 2 + STAFF_CARD_GAP_SIZE + STAFF_GLOBAL_PADDING;

  return (
    <Card
      sx={{
        width: STAFF_DEFAULT_CARD_SIZE,
        [getContainerQuery(theme.breakpoints.down(customBreakpoint))]: {
          width: '100%'
        }
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: STAFF_DEFAULT_CARD_SIZE,
          [getContainerQuery(theme.breakpoints.down(customBreakpoint))]: {
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
  );
};

export default StaffCard;
