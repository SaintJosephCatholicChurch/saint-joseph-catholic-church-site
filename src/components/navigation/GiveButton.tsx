import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { EXTRA_EXTRA_SMALL_BREAKPOINT } from '../../constants';
import getContainerQuery from '../../util/container.util';

interface GiveButtonProps {
  title: string;
  onlineGivingUrl: string;
  size?: 'small' | 'normal';
  inCMS: boolean;
}

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)(
  ({ theme }) => `
    width: 24px;
    ${theme.breakpoints.down('sm')} {
      width: 16px;
    }
  `
);

const GiveButton = ({ title, onlineGivingUrl, size = 'normal', inCMS }: GiveButtonProps) => {
  const theme = useTheme();
  const trigger = useScrollTrigger({ disableHysteresis: true });

  return (
    <Button
      href={onlineGivingUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: '#bf303c',
        backgroundColor: '#ffffff',
        borderRadius: 0,
        position: 'relative',
        right: 0,
        top: 0,
        bottom: 0,
        fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
        fontSize: '17px',
        display: 'grid',
        gridTemplateColumns: '24px auto',
        alignItems: 'center',
        padding: '1px 36px 0',
        gap: '8px',
        height: 70,
        width: 162,
        zIndex: 1,
        '&:hover': {
          color: '#822129',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        },
        ...(size === 'small'
          ? {
              padding: '1px 24px 0',
              width: 130
            }
          : {}),
        [theme.breakpoints.up('lg')]: {
          transition: 'height 250ms ease',
          height: trigger ? 64 : 92
        },
        [theme.breakpoints.down('lg')]: {
          padding: '1px 24px 0',
          width: 120
        },
        [theme.breakpoints.down('sm')]: {
          width: 100,
          gridTemplateColumns: '16px auto',
          gap: '6px'
        },
        [getContainerQuery(theme.breakpoints.down(EXTRA_EXTRA_SMALL_BREAKPOINT), inCMS)]: {
          padding: '1px 16px 0'
        }
      }}
    >
      <StyledFontAwesomeIcon icon={faHandHoldingDollar} />
      {title}
    </Button>
  );
};

export default GiveButton;
