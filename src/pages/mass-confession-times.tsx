import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import PageLayout from '../components/PageLayout';
import MobileScheduleTabPanel from '../components/schedule/MobileSchedulePanel';
import ScheduleTabPanel from '../components/schedule/ScheduleTabPanel';
import times from '../lib/times';
import styled from '../util/styled.util';

const StyledTimes = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 72px;

    ${theme.breakpoints.down('md')} {
      display: none;
    }
  `
);

const MassConfessionTimes = () => {
  const theme = useTheme();

  return (
    <PageLayout url="/mass-confession-times" title="Mass &amp; Confession Times" hideHeader>
      <List
        component="div"
        aria-labelledby="nested-list-subheader"
        disablePadding
        sx={{
          width: '100%',
          [theme.breakpoints.up('md')]: {
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
    </PageLayout>
  );
};

export default MassConfessionTimes;
