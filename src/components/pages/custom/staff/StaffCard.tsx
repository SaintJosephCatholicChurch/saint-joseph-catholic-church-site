import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { getAdminPreviewFieldTargetProps } from '../../../../admin/content-sections/components/adminPreviewSelection';
import { createStaffFieldKey, type StaffFieldKey } from '../../../../admin/content-sections/staff/fieldKeys';
import { STAFF_CARD_GAP_SIZE, STAFF_DEFAULT_CARD_SIZE, STAFF_GLOBAL_PADDING } from '../../../../constants';
import getContainerQuery from '../../../../util/container.util';

import type { Staff } from '../../../../interface';

interface StaffCardProps {
  activeFieldKey?: StaffFieldKey;
  index: number;
  staffMember: Staff;
}

const ACTIVE_PREVIEW_TARGET_STYLE = {
  backgroundColor: 'rgba(188, 47, 59, 0.1)',
  borderRadius: '4px',
  boxShadow: 'inset 0 0 0 1px rgba(127, 35, 44, 0.24)'
} as const;

function getActivePreviewTargetStyle(fieldKey: StaffFieldKey, activeFieldKey?: StaffFieldKey) {
  return activeFieldKey === fieldKey ? ACTIVE_PREVIEW_TARGET_STYLE : undefined;
}

const StaffCard = ({ activeFieldKey, index, staffMember }: StaffCardProps) => {
  const theme = useTheme();

  const customBreakpoint = STAFF_DEFAULT_CARD_SIZE * 2 + STAFF_CARD_GAP_SIZE + STAFF_GLOBAL_PADDING;
  const nameFieldKey = createStaffFieldKey(index, 'name');
  const pictureFieldKey = createStaffFieldKey(index, 'picture');
  const titleFieldKey = createStaffFieldKey(index, 'title');

  return (
    <Card
      {...getAdminPreviewFieldTargetProps(nameFieldKey)}
      sx={{
        ...getActivePreviewTargetStyle(nameFieldKey, activeFieldKey),
        width: STAFF_DEFAULT_CARD_SIZE,
        [getContainerQuery(theme.breakpoints.down(customBreakpoint))]: {
          width: '100%'
        }
      }}
    >
      <CardMedia
        component="img"
        {...getAdminPreviewFieldTargetProps(pictureFieldKey)}
        sx={{
          ...getActivePreviewTargetStyle(pictureFieldKey, activeFieldKey),
          height: STAFF_DEFAULT_CARD_SIZE,
          [getContainerQuery(theme.breakpoints.down(customBreakpoint))]: {
            height: '80vw'
          }
        }}
        image={staffMember.picture}
        alt="green iguana"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          {...getAdminPreviewFieldTargetProps(nameFieldKey)}
          sx={getActivePreviewTargetStyle(nameFieldKey, activeFieldKey)}
        >
          {staffMember.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          {...getAdminPreviewFieldTargetProps(titleFieldKey)}
          sx={getActivePreviewTargetStyle(titleFieldKey, activeFieldKey)}
        >
          {staffMember.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
