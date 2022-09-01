import styled from '../../../util/styled.util';
import SearchBox from '../../SearchBox';
import DailyReadings from './DailyReadings';

const StyledSidebar = styled('div')(
  ({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;
    ${theme.breakpoints.down('md')} {
      display: none;
    }
  `
);

const StyledSection = styled('div')`
  border-bottom: 1px solid #adadad;
  padding-bottom: 32px;
`;

const Sidebar = () => {
  return (
    <StyledSidebar>
      <StyledSection>
        <SearchBox disableMargin />
      </StyledSection>
      <StyledSection>
        <DailyReadings />
      </StyledSection>
    </StyledSidebar>
  );
};

export default Sidebar;
