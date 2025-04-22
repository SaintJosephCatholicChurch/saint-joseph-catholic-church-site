'use client';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';

import MobileScheduleTabPanel from '../../../../components/schedule/MobileSchedulePanel';
import ScheduleTabPanel from '../../../../components/schedule/ScheduleTabPanel';
import times from '../../../../lib/times';
import getContainerQuery from '../../../../util/container.util';

import type { FC } from 'react';
import type { Times } from '../../../../interface';

const StyledTimes = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 72px;

    ${getContainerQuery(theme.breakpoints.down('md'))} {
      display: none;
    }
  `
);

export interface MassTimesProps {
  times: Times[];
}

const MassTimes: FC<MassTimesProps> = () => {
  const theme = useTheme();

  return (
    <>
      <List
        component="div"
        aria-labelledby="nested-list-subheader"
        disablePadding
        sx={{
          width: '100%',
          [getContainerQuery(theme.breakpoints.up('md'))]: {
            display: 'none'
          }
        }}
      >
        {times.map((timeSchedule, index) => (
          <MobileScheduleTabPanel key={`mobile-schedule-panel-${index}`} times={timeSchedule} index={index} />
        ))}
      </List>
      <StyledTimes>
        {times.map((timeSchedule, index) => (
          <ScheduleTabPanel
            key={`schedule-tab-${index}`}
            value={index}
            index={index}
            times={timeSchedule}
            disablePadding
            variant="compact"
          />
        ))}
      </StyledTimes>
    </>
  );
};

export default MassTimes;
