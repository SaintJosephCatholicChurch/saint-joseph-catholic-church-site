import styled from '../../util/styled.util';
import LogoPrimaryText from './LogoPrimaryText';
import LogoSecondaryText from './LogoSecondaryText';

const StyledHeaderLink = styled('a')`
  display: flex;
  flex-direction: column;
  align-items: center;
  top: -2px;
  position: relative;
`;

interface LogoWrapperProps {
  trigger: boolean;
  responsive: boolean;
}

const StyledLogoWrapper = styled('div', ['trigger', 'responsive'])<LogoWrapperProps>(
  ({ theme, trigger, responsive }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 250ms ease;

    transform: ${trigger ? 'scale(0.75)' : 'scale(1)'};
    ${theme.breakpoints.down('lg')} {
      transform: ${responsive ? 'scale(0.75)' : 'scale(1)'};
    }
  `
);

interface LogoProps {
  trigger?: boolean;
  responsive?: boolean;
}

const Logo = ({ trigger = false, responsive = true }: LogoProps) => {
  // TODO: Make configurable
  return (
    <StyledHeaderLink href="/">
      <StyledLogoWrapper trigger={trigger} responsive={responsive}>
        <LogoPrimaryText>St. Joseph</LogoPrimaryText>
        <LogoSecondaryText>Catholic Church</LogoSecondaryText>
      </StyledLogoWrapper>
    </StyledHeaderLink>
  );
};

export default Logo;
