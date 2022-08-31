import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { MENU_DELAY } from '../../constants';
import { MenuItem, MenuLink } from '../../lib/menu';
import { useDebouncedToggleOff } from '../../util/useDebounce';
import { CleanLink } from '../common-styled';
import NavLink from './NavLink';

const StyledButton = styled(Button)`
  color: #d6bf86;
  lineheight: 60px;
  padding: 10px 20px;
  whitespace: nowrap;

  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  font-size: 17px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;

  &:hover {
    color: #ffffff;

    .menu-item-underline {
      width: 100%;
    }
  }
`;

const StyledUnderlineWrapper = styled('div')`
  position: absolute;
  width: 80%;
  left: 10%;
  top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledUnderline = styled('div')`
  transition: width 0.3s ease-in-out;
  height: 2px;
  width: 0%;
  background: #ffffff;
`;

interface NavItemProps {
  item: MenuItem;
}

function isMenuItem(link: MenuItem | MenuLink): link is MenuItem {
  return Boolean('menu_links' in link && (link as MenuItem).menu_links?.length);
}

interface HoverState {
  button: boolean;
  menu: boolean;
  icon: boolean;
  text: boolean;
}

const NavItem = ({ item }: NavItemProps) => {
  const [open, setOpen] = useState<HoverState>({
    button: false,
    menu: false,
    icon: false,
    text: false
  });

  const handleOnMouseOver = useCallback(
    (type: keyof HoverState) => () => {
      setOpen({
        ...open,
        [type]: true
      });
    },
    [open]
  );

  const handleOnMouseOut = useCallback(
    (type: keyof HoverState) => () => {
      setOpen({
        ...open,
        [type]: false
      });
    },
    [open]
  );

  const handleClose = useCallback(() => {
    setOpen({
      button: false,
      menu: false,
      icon: false,
      text: false
    });
  }, []);

  const isOpen = useMemo(() => open.button || open.menu || open.icon || open.text, [open]);
  const debouncedIsOpen = useDebouncedToggleOff(isOpen, MENU_DELAY);

  useEffect(() => {
    if (debouncedIsOpen) {
      return;
    }

    handleClose();
  }, [debouncedIsOpen, handleClose]);

  const handleOnClick = useCallback(
    (link: MenuItem | MenuLink, type: keyof HoverState) => (event: MouseEvent) => {
      if (isMenuItem(link)) {
        handleOnMouseOver(type)();
        return;
      }

      handleOnMouseOut(type)();
    },
    [handleOnMouseOut, handleOnMouseOver]
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledButton
        onClick={handleOnClick(item, 'button')}
        onMouseOver={handleOnMouseOver('button')}
        onMouseOut={handleOnMouseOut('button')}
        size="large"
      >
        <Box
          sx={{ display: 'flex', height: '26px' }}
          onMouseOver={handleOnMouseOver('text')}
          onMouseOut={handleOnMouseOut('text')}
        >
          {item.menu_links?.length ? (
            item.title
          ) : (
            <CleanLink target={item.url?.startsWith('http') ? '_blank' : undefined} href={item.url ?? `/${item.page}`}>
              {item.title}
            </CleanLink>
          )}
        </Box>
        {item.menu_links?.length ? (
          <ExpandMoreIcon
            fontSize="small"
            onMouseOver={handleOnMouseOver('icon')}
            onMouseOut={handleOnMouseOut('icon')}
          />
        ) : (
          <StyledUnderlineWrapper>
            <StyledUnderline className="menu-item-underline" />
          </StyledUnderlineWrapper>
        )}
      </StyledButton>
      {item.menu_links?.length && debouncedIsOpen ? (
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            background: '#f2f2f2',
            boxShadow: '2px 2px 2px 0 rgb(0 0 0 / 3%)',
            top: '46px'
          }}
          onMouseOver={handleOnMouseOver('menu')}
          onMouseOut={handleOnMouseOut('menu')}
        >
          {item.menu_links.map((link) => (
            <NavLink key={`menu-${item.title}-link-${link.title}`} link={link} onClick={handleOnClick(link, 'menu')} />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default NavItem;
