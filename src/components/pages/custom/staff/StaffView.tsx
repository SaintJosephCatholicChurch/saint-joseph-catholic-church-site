import { styled } from '@mui/material/styles';
import { STAFF_CARD_GAP_SIZE } from '../../../../constants';
import { Staff } from '../../../../interface';
import StaffCard from './StaffCard';

const StyledStaffWrapper = styled('div')`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${STAFF_CARD_GAP_SIZE}px;
  width: 100%;
`;

interface StaffViewProps {
  staff: Staff[];
}

const StaffView = ({ staff }: StaffViewProps) => {
  return (
    <StyledStaffWrapper>
      {staff.map((staffMember, index) => (
        <StaffCard key={`staff-${index}`} staffMember={staffMember} />
      ))}
    </StyledStaffWrapper>
  );
};

export default StaffView;
