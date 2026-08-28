import { styled } from '@mui/material/styles';

import { STAFF_CARD_GAP_SIZE } from '../../../../constants';
import StaffCard from './StaffCard';

import type { Staff } from '../../../../interface';

const StyledStaffWrapper = styled('div')`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${STAFF_CARD_GAP_SIZE}px;
  width: 100%;
  padding-bottom: ${STAFF_CARD_GAP_SIZE}px;
`;

interface StaffViewProps {
  activeFieldKey?: string;
  createFieldKey?: (clientId: string, field: string) => string;
  staff: Staff[];
}

const StaffView = ({ activeFieldKey, createFieldKey, staff }: StaffViewProps) => {
  return (
    <StyledStaffWrapper>
      {staff.map((staffMember, index) => (
        <StaffCard
          activeFieldKey={activeFieldKey}
          createFieldKey={createFieldKey}
          index={index}
          key={staffMember.clientId || `staff-${index}`}
          staffMember={staffMember}
        />
      ))}
    </StyledStaffWrapper>
  );
};

export default StaffView;
