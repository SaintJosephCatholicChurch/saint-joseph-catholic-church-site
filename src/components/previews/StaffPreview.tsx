import { styled, useTheme } from '@mui/material/styles';
import { PreviewTemplateComponentProps } from '@staticcms/core';
import { useMemo } from 'react';
import { Staff } from '../../interface';
import StaffView from '../pages/custom/staff/StaffView';

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
  const theme = useTheme();

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
