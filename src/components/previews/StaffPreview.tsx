import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import StaffView from '../pages/custom/staff/StaffView';

import type { PreviewTemplateComponentProps } from '@staticcms/core';
import type { Staff } from '../../interface';

const StyledStaffWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
`;

const StyledStaffContent = styled('div')`
  max-width: 725px;
  width: 100%;
`;

const StaffPreview = ({ entry }: PreviewTemplateComponentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const staff = useMemo(() => entry.toJS().data.staff as Staff[], [entry]);

  return useMemo(
    () => (
      <StyledStaffWrapper>
        <StyledStaffContent>
          <StaffView staff={staff} />
        </StyledStaffContent>
      </StyledStaffWrapper>
    ),
    [staff]
  );
};

export default StaffPreview;
