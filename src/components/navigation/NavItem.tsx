import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { MENU_DELAY } from '../../constants';
import { MenuItem, MenuLink } from '../../interface';
import { isNotEmpty } from '../../util/string.util';
import { useDebouncedToggleOff } from '../../util/useDebounce';
import useLocation from '../../util/useLocation';
import NavLink from './NavLink';

const StyledNavItem = styled('div')`
  position: relative;
`;

interface StyledButtonProps {
  selected: boolean;
}

const StyledButton = styled(Button)<StyledButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ selected }) => `
    padding: 12px 18px 14px;
    whitespace: nowrap;

    font-family: 'Oswald', Helvetica, Arial, sans-serif;
    font-size: 17px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;

    color: ${selected ? '#ffffff' : '#fde7a5'};

    &:hover {
      color: #ffffff;
      background-color: #d34f5a;

      .menu-item-underline {
        width: 90%;
      }
    }
  `
);

const StyledButtonTitle = styled('div')`
  display: flex;
  height: 26px;
`;

interface StyledExpandMoreIconProps {
  debouncedIsOpen: boolean;
}

const StyledExpandMoreIcon = styled(ExpandMoreIcon)<StyledExpandMoreIconProps>(
  ({ debouncedIsOpen }) => `
    top: 2px;
    position: relative;
    transition: transform 333ms ease-out;
    transform: rotate(${debouncedIsOpen ? '-180deg' : '0deg'});
  `
);

const StyledUnderlineWrapper = styled('div')`
  position: absolute;
  width: 80%;
  left: 10%;
  top: 44px;
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

const StyledPopUpMenu = styled('div')`
  position: absolute;
  display: flex;
  flexdirection: column;
  background: #f2f2f2;
  boxshadow: 2px 2px 2px 0 rgb(0 0 0 / 3%);
  top: 54px;
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
  const { pathname } = useLocation();

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

  const getUrl = useCallback((link: MenuLink) => {
    if (isNotEmpty(link.url)) {
      return link.url;
    }

    if (isNotEmpty(link.page)) {
      return `/${link.page}`;
    }

    return '';
  }, []);

  const url = useMemo(() => {
    if (item.menu_links?.length) {
      return getUrl(item.menu_links[0]);
    }

    return getUrl(item);
  }, [getUrl, item]);

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (pathname === getUrl(item)) {
      setSelected(true);
      return;
    }

    if (item.menu_links?.length) {
      setSelected(Boolean(item.menu_links.find((link) => pathname === getUrl(link))));
      return;
    }

    setSelected(false);
  }, [getUrl, item, pathname]);

  return (
    <StyledNavItem>
      <StyledButton
        onClick={handleOnClick(item, 'button')}
        onMouseOver={handleOnMouseOver('button')}
        onMouseOut={handleOnMouseOut('button')}
        size="large"
        target={url?.startsWith('http') ? '_blank' : undefined}
        href={url}
        selected={selected}
      >
        <StyledButtonTitle onMouseOver={handleOnMouseOver('text')} onMouseOut={handleOnMouseOut('text')}>
          {item.title}
        </StyledButtonTitle>
        {item.menu_links?.length ? (
          <StyledExpandMoreIcon
            fontSize="small"
            onMouseOver={handleOnMouseOver('icon')}
            onMouseOut={handleOnMouseOut('icon')}
            debouncedIsOpen={debouncedIsOpen}
          />
        ) : null}
        <StyledUnderlineWrapper>
          <StyledUnderline className="menu-item-underline" />
        </StyledUnderlineWrapper>
      </StyledButton>
      {item.menu_links?.length && debouncedIsOpen ? (
        <StyledPopUpMenu onMouseOver={handleOnMouseOver('menu')} onMouseOut={handleOnMouseOut('menu')}>
          {item.menu_links.map((link) => (
            <NavLink key={`menu-${item.title}-link-${link.title}`} link={link} onClick={handleOnClick(link, 'menu')} />
          ))}
        </StyledPopUpMenu>
      ) : null}
    </StyledNavItem>
  );
};

export default NavItem;
