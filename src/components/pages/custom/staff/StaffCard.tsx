import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useResolvedMediaSrc } from '../../../../admin/previewMediaUrls';
import {
  getActiveAdminPreviewTargetStyle,
  getAdminPreviewFieldTargetProps
} from '../../../../components/common/adminPreviewTarget';
import { STAFF_CARD_GAP_SIZE, STAFF_DEFAULT_CARD_SIZE, STAFF_GLOBAL_PADDING } from '../../../../constants';
import getContainerQuery from '../../../../util/container.util';

import type { Staff } from '../../../../interface';

interface StaffCardProps {
  activeFieldKey?: string;
  createFieldKey?: (clientId: string, field: string) => string;
  index: number;
  staffMember: Staff;
}

const StaffCard = ({ activeFieldKey, createFieldKey, index, staffMember }: StaffCardProps) => {
  const theme = useTheme();
  const resolvedPicture = useResolvedMediaSrc(staffMember.picture || '');
  const staffFieldId = staffMember.clientId || String(index);

  const customBreakpoint = STAFF_DEFAULT_CARD_SIZE * 2 + STAFF_CARD_GAP_SIZE + STAFF_GLOBAL_PADDING;
  const nameFieldKey = createFieldKey?.(staffFieldId, 'name');
  const pictureFieldKey = createFieldKey?.(staffFieldId, 'picture');
  const titleFieldKey = createFieldKey?.(staffFieldId, 'title');

  return (
    <Card
      {...getAdminPreviewFieldTargetProps(nameFieldKey)}
      sx={{
        ...getActiveAdminPreviewTargetStyle(nameFieldKey, activeFieldKey),
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
          ...getActiveAdminPreviewTargetStyle(pictureFieldKey, activeFieldKey),
          height: STAFF_DEFAULT_CARD_SIZE,
          [getContainerQuery(theme.breakpoints.down(customBreakpoint))]: {
            height: '80vw'
          }
        }}
        image={resolvedPicture}
        alt={staffMember.name || staffMember.title || 'Staff member'}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          {...getAdminPreviewFieldTargetProps(nameFieldKey)}
          sx={getActiveAdminPreviewTargetStyle(nameFieldKey, activeFieldKey)}
        >
          {staffMember.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          {...getAdminPreviewFieldTargetProps(titleFieldKey)}
          sx={getActiveAdminPreviewTargetStyle(titleFieldKey, activeFieldKey)}
        >
          {staffMember.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
