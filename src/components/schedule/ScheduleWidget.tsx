import type { Times } from '../../interface';
import styled from '../../util/styled.util';
import Container from '../layout/Container';
import Schedule from './Schedule';

interface StyledScheduleProps {
  background: string;
}

const StyledSchedule = styled('div', ['background'])<StyledScheduleProps>(
  ({ theme, background }) => `
    padding-bottom: 40px;
    background :linear-gradient(183.55deg, #f1f1f1 3%, rgba(241, 241, 241, 0) 30%), url(${background}), #c7c7c7;
    background-repeat: repeat;
    background-position: center top;
    display: flex;
    align-items: center;
    justify-content: center;

    padding-top: 40px;
    ${theme.breakpoints.down('md')} {
      padding-top: 24px;
    }
  `
);

interface ScheduleProps {
  times: Times[];
  background?: string;
  tab?: number;
  onTabChange?: (index: number) => void;
}

const ScheduleWidget = ({ times, background, tab, onTabChange }: ScheduleProps) => {
  return (
    <StyledSchedule background={background}>
      <Container>
        <Schedule times={times} tab={tab} onTabChange={onTabChange} />
      </Container>
    </StyledSchedule>
  );
};

export default ScheduleWidget;
