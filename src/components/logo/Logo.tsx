import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { LogoDetails } from '../../interface';
import transientOptions from '../../util/transientOptions';
import LogoPrimaryText from './LogoPrimaryText';
import LogoSecondaryText from './LogoSecondaryText';

const StyledHeaderLink = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  top: -2px;
  position: relative;
  cursor: pointer;
`;

interface LogoWrapperProps {
  $trigger: boolean;
  $responsive: boolean;
  $size: 'small' | 'normal';
}

const StyledLogoWrapper = styled(
  'div',
  transientOptions
)<LogoWrapperProps>(
  ({ theme, $trigger, $responsive, $size }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 250ms ease;

    transform: ${$size === 'small' || $trigger ? 'scale(0.75)' : 'scale(1)'};
    ${theme.breakpoints.down('lg')} {
      transform: ${$responsive ? 'scale(0.75)' : 'scale(1)'};
    }
  `
);

interface LogoProps {
  trigger?: boolean;
  responsive?: boolean;
  size?: 'small' | 'normal';
  details: LogoDetails;
}

const Logo = ({ trigger = false, responsive = true, details: { primary, secondary }, size = 'normal' }: LogoProps) => {
  return (
    <Link href="/">
      <StyledHeaderLink>
        <StyledLogoWrapper $trigger={trigger} $responsive={responsive} $size={size}>
          <LogoPrimaryText>{primary}</LogoPrimaryText>
          <LogoSecondaryText>{secondary}</LogoSecondaryText>
        </StyledLogoWrapper>
      </StyledHeaderLink>
    </Link>
  );
};

export default Logo;
