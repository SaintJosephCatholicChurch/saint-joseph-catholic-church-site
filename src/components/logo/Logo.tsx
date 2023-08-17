import { styled } from '@mui/material/styles';
import Link from 'next/link';

import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';
import LogoPrimaryText from './LogoPrimaryText';
import LogoSecondaryText from './LogoSecondaryText';

import type { LogoDetails } from '../../interface';

const StyledHeaderLink = styled(Link)`
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
    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      transform: ${$responsive ? 'scale(0.75)' : 'scale(1)'};
    }
  `
);

interface LogoProps {
  trigger?: boolean;
  responsive?: boolean;
  size?: 'small' | 'normal';
  details: LogoDetails;
  inCMS: boolean;
}

const Logo = ({ trigger = false, responsive = true, details: { primary, secondary }, size = 'normal', inCMS }: LogoProps) => {
  return (
    <StyledHeaderLink href="/">
      <StyledLogoWrapper $trigger={trigger} $responsive={responsive} $size={size}>
        <LogoPrimaryText inCMS={inCMS}>{primary}</LogoPrimaryText>
        <LogoSecondaryText inCMS={inCMS}>{secondary}</LogoSecondaryText>
      </StyledLogoWrapper>
    </StyledHeaderLink>
  );
};

export default Logo;
