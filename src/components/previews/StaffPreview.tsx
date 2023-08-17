import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import StaffView from '../pages/custom/staff/StaffView';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { Staff } from '../../interface';

const StyledStaffWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  container: page / inline-size;
  font-family:
    Open Sans,
    Roboto,
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Oxygen-Sans,
    Ubuntu,
    Cantarell,
    Helvetica Neue,
    sans-serif;
  background-color: #f5f4f3;
  color: #222;
  font-weight: 200;
  font-size: 16px;
`;

const StyledStaffContent = styled('div')`
  max-width: 725px;
  width: 100%;
`;

const StaffPreview: TemplatePreviewComponent<{ staff: Staff[] }> = ({ entry }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const staff = useMemo(() => entry.data.staff, [entry.data.staff]);

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
