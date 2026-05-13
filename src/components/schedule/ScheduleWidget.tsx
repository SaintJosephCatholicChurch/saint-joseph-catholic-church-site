import { styled } from '@mui/material/styles';

import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';
import Container from '../layout/Container';
import Schedule from './Schedule';
import type { HomepageFieldKey } from '../../admin/content-sections/homepage/fieldKeys';

import type { LiveStreamButton, ScheduleSection, Times } from '../../interface';

interface ScheduleAdminSelection {
  activePathKey?: string;
}

interface HomepageScheduleAdminSelection {
  activeFieldKey?: HomepageFieldKey;
  invitationTextFieldKey?: HomepageFieldKey;
  liveStreamButtonFieldKey?: HomepageFieldKey;
  massTimesTarget?: boolean;
  scheduleTitleFieldKey?: HomepageFieldKey;
}

interface StyledScheduleProps {
  $background: string;
}

const StyledSchedule = styled(
  'div',
  transientOptions
)<StyledScheduleProps>(
  ({ theme, $background }) => `
    padding-bottom: 40px;
    background: linear-gradient(rgba(241, 241, 241, 0.5) 0%, rgba(241, 241, 241, 0) 50%), url(${$background}), #c7c7c7;
    background-repeat: repeat;
    background-position: center top;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 24px;
    padding-left: 24px;

    padding-top: 40px;
    ${getContainerQuery(theme.breakpoints.down('md'))} {
      padding-top: 24px;
    }
  `
);

interface ScheduleProps {
  adminSelection?: ScheduleAdminSelection;
  homepageAdminSelection?: HomepageScheduleAdminSelection;
  inCMS?: boolean;
  times: Times[];
  details?: ScheduleSection;
  liveStreamButton?: LiveStreamButton;
  invitationText?: string;
  facebookPage?: string;
  tab?: number;
  onTabChange?: (index: number) => void;
}

const ScheduleWidget = ({
  adminSelection,
  homepageAdminSelection,
  inCMS = false,
  times,
  details,
  liveStreamButton,
  invitationText,
  facebookPage,
  tab,
  onTabChange
}: ScheduleProps) => {
  return (
    <StyledSchedule $background={details?.schedule_background}>
      <Container>
        <Schedule
          adminSelection={adminSelection}
          homepageAdminSelection={homepageAdminSelection}
          inCMS={inCMS}
          times={times}
          title={details?.title}
          liveStreamButton={liveStreamButton}
          invitationText={invitationText}
          facebookPage={facebookPage}
          tab={tab}
          onTabChange={onTabChange}
        />
      </Container>
    </StyledSchedule>
  );
};

export default ScheduleWidget;
