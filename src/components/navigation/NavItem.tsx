import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MENU_DELAY } from '../../constants';
import { isEmpty } from '../../util/string.util';
import { useDebouncedToggleOff } from '../../util/useDebounce';
import useLocation from '../../util/useLocation';
import { useMediaQueryUp } from '../../util/useMediaQuery';
import { getMenuLinkUrl } from './hooks/useMenuLinkUrl';
import NavItemPopup from './NavItemPopup';

import type { KeyboardEvent, MouseEvent } from 'react';
import type { MenuItem, MenuLink } from '../../interface';

const StyledNavItem = styled('div')`
  position: relative;
`;

const StyledButtonTitle = styled('div')`
  display: flex;
  height: 26px;
`;

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

function isMenuItem(link: MenuItem | MenuLink): link is MenuItem {
  return Boolean('menu_links' in link && link.menu_links?.length);
}

export interface HoverState {
  keyboardPress: boolean;
  buttonClick: boolean;
  button: boolean;
  menu: boolean;
  icon: boolean;
  text: boolean;
}

interface NavItemProps {
  item: MenuItem;
  size?: 'small' | 'normal';
}

const NavItem = ({ item, size }: NavItemProps) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const buttonRef = useRef<HTMLButtonElement>();
  const activeMenuItemRef = useRef<HTMLButtonElement>();
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState(-1);
  const [open, setOpen] = useState<HoverState>({
    keyboardPress: false,
    buttonClick: false,
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
      keyboardPress: false,
      buttonClick: false,
      button: false,
      menu: false,
      icon: false,
      text: false
    });
    setKeyboardSelectedIndex(-1);
  }, []);

  const isLargeScreen = useMediaQueryUp('lg');

  const isOpen = useMemo(
    () =>
      open.keyboardPress || (!isLargeScreen && open.buttonClick) || open.button || open.menu || open.icon || open.text,
    [isLargeScreen, open.button, open.buttonClick, open.icon, open.keyboardPress, open.menu, open.text]
  );
  const debouncedIsOpen = useDebouncedToggleOff(isOpen, MENU_DELAY);

  const handleOnKeyDown = useCallback(
    (type: keyof HoverState) => (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter') {
        setOpen({
          ...open,
          [type]: !open[type]
        });
        return;
      }

      if (event.key === 'ArrowDown') {
        if (!isOpen) {
          setOpen({
            ...open,
            [type]: true
          });
          return;
        }

        setKeyboardSelectedIndex(0);
        setTimeout(() => {
          activeMenuItemRef.current?.focus();
        }, 10);
        return;
      }

      if (event.key === 'Tab' && !event.shiftKey && isOpen) {
        setKeyboardSelectedIndex(0);
      }
    },
    [isOpen, open]
  );

  const handleMenuLinkKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown') {
        if (!isOpen) {
          return;
        }

        if (keyboardSelectedIndex + 1 >= (item.menu_links?.length ?? 0)) {
          return;
        }

        setKeyboardSelectedIndex(keyboardSelectedIndex + 1);
        setTimeout(() => {
          activeMenuItemRef.current?.focus();
        }, 10);
        return;
      }

      if (event.key === 'ArrowUp') {
        if (!isOpen) {
          return;
        }

        if (keyboardSelectedIndex <= 0) {
          handleClose();
          buttonRef.current?.focus();
          return;
        }

        setKeyboardSelectedIndex(keyboardSelectedIndex - 1);
        setTimeout(() => {
          activeMenuItemRef.current?.focus();
        }, 10);
        return;
      }

      if (event.key === 'Tab') {
        if (!isOpen) {
          return;
        }

        if (event.shiftKey) {
          if (keyboardSelectedIndex <= 0) {
            handleClose();
            return;
          }

          setKeyboardSelectedIndex(keyboardSelectedIndex - 1);
          return;
        }

        if (keyboardSelectedIndex + 1 >= (item.menu_links?.length ?? 0)) {
          handleClose();
          return;
        }

        setKeyboardSelectedIndex(keyboardSelectedIndex + 1);
        return;
      }
    },
    [handleClose, isOpen, item.menu_links?.length, keyboardSelectedIndex]
  );

  useEffect(() => {
    if (debouncedIsOpen) {
      return;
    }

    handleClose();
  }, [debouncedIsOpen, handleClose]);

  const handleOnClick = useCallback(
    (link: MenuItem | MenuLink, type: keyof HoverState) => (_event: MouseEvent) => {
      if (isMenuItem(link) && (isLargeScreen || !open[type])) {
        handleOnMouseOver(type)();
        return;
      }

      handleClose();
    },
    [handleClose, handleOnMouseOver, isLargeScreen, open]
  );

  const url = useMemo(() => {
    return getMenuLinkUrl(item);
  }, [item]);

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (pathname === getMenuLinkUrl(item)) {
      setSelected(true);
      return;
    }

    if (item.menu_links?.length) {
      setSelected(Boolean(item.menu_links.find((link) => pathname === getMenuLinkUrl(link))));
      return;
    }

    setSelected(false);
  }, [item, pathname]);

  const wrappedLink = useMemo(() => {
    const button = (
      <Button
        ref={buttonRef}
        onClick={handleOnClick(item, 'buttonClick')}
        onKeyDown={handleOnKeyDown('keyboardPress')}
        onMouseOver={handleOnMouseOver('button')}
        onMouseOut={handleOnMouseOut('button')}
        size="large"
        sx={{
          padding: '12px 18px 14px',
          whitespace: 'nowrap',
          fontFamily: "'Oswald', Helvetica, Arial, sans-serif",
          fontSize: '17px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          color: selected ? '#ffffff' : '#fde7a5',
          ...(debouncedIsOpen
            ? {
                color: '#ffffff',
                backgroundColor: '#d34f5a',
                '.menu-item-underline': {
                  width: '90%'
                }
              }
            : {}),
          '&:hover': {
            color: '#ffffff',
            backgroundColor: '#d34f5a',
            '.menu-item-underline': {
              width: '90%'
            }
          },
          ...(size
            ? {
                padding: '12px 12px 14px'
              }
            : {}),
          [theme.breakpoints.down('lg')]: {
            padding: '12px 12px 14px'
          },
          [theme.breakpoints.between('md', 1000)]: {
            fontSize: '16px',
            padding: '12px 6px 14px'
          }
        }}
      >
        <StyledButtonTitle onMouseOver={handleOnMouseOver('text')} onMouseOut={handleOnMouseOut('text')}>
          {item.title}
        </StyledButtonTitle>
        {item.menu_links?.length ? (
          <ExpandMoreIcon
            fontSize="small"
            onMouseOver={handleOnMouseOver('icon')}
            onMouseOut={handleOnMouseOut('icon')}
            sx={{
              top: '2px',
              position: 'relative',
              transition: 'transform 333ms ease-out',
              transform: `rotate(${debouncedIsOpen ? '-180deg' : '0deg'})`
            }}
          />
        ) : null}
        <StyledUnderlineWrapper>
          <StyledUnderline className="menu-item-underline" />
        </StyledUnderlineWrapper>
      </Button>
    );

    if (isEmpty(url)) {
      return button;
    }

    return (
      <Link target={url?.startsWith('http') ? '_blank' : undefined} href={url}>
        {button}
      </Link>
    );
  }, [
    debouncedIsOpen,
    handleOnClick,
    handleOnKeyDown,
    handleOnMouseOut,
    handleOnMouseOver,
    item,
    selected,
    size,
    theme.breakpoints,
    url
  ]);

  return (
    <StyledNavItem>
      {wrappedLink}
      {item.menu_links?.length && debouncedIsOpen ? (
        <NavItemPopup
          item={item}
          onClick={handleOnClick}
          onMouseOver={handleOnMouseOver}
          onMouseOut={handleOnMouseOut}
          onKeyDown={handleMenuLinkKeyDown}
          activeMenuItemRef={activeMenuItemRef}
          keyboardSelectedIndex={keyboardSelectedIndex}
        />
      ) : null}
    </StyledNavItem>
  );
};

export default NavItem;
