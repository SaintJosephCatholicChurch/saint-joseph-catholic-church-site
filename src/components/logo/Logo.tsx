import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import LogoPrimaryText from './LogoPrimaryText';
import LogoSecondaryText from './LogoSecondaryText';

const HeaderLink = styled('a')`
  display: flex;
  flex-direction: column;
  align-items: center;
  top: -2px;
  position: relative;
`;

const LogoWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 250ms ease;
`;

interface LogoProps {
  trigger?: boolean;
  responsive?: boolean;
}

const Logo = ({ trigger = false, responsive = true }: LogoProps) => {
  const theme = useTheme();

  return (
    <HeaderLink href="/">
      <LogoWrapper
        sx={
          trigger
            ? {
                transform: 'scale(0.75)'
              }
            : {
                transform: 'scale(1)',
                [theme.breakpoints.down('md')]: {
                  transform: responsive ? 'scale(0.75)' : 'scale(1)'
                }
              }
        }
      >
        <LogoPrimaryText>St. Joseph</LogoPrimaryText>
        <LogoSecondaryText>Catholic Church</LogoSecondaryText>
      </LogoWrapper>
    </HeaderLink>
  );
};

export default Logo;
