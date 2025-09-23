import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MENU_DELAY } from '../../constants';
import getContainerQuery from '../../util/container.util';
import { isEmpty } from '../../util/string.util';
import useClickOutside from '../../util/useClickOutside';
import { useDebouncedToggleOff } from '../../util/useDebounce';
import useLocation from '../../util/useLocation';
import NavItemPopup from './NavItemPopup';
import { getMenuLinkUrl } from './hooks/useMenuLinkUrl';

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

interface NavItemProps {
  item: MenuItem;
  size?: 'small' | 'normal';
  inCMS: boolean;
}

const NavItem = ({ item, size, inCMS }: NavItemProps) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const wrapperRef = useRef<HTMLDivElement>();
  const buttonRef = useRef<HTMLButtonElement>();
  const activeMenuItemRef = useRef<HTMLButtonElement>();
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setKeyboardSelectedIndex(-1);
  }, []);

  const handleOnMouseOver = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  const handleOnMouseOut = useCallback(() => {
    handleClose();
  }, [handleClose]);

  useClickOutside(wrapperRef, handleClose);

  const isOpen = useMemo(() => open, [open]);
  const debouncedIsOpen = useDebouncedToggleOff(isOpen, MENU_DELAY);

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const target = event.target;
      if ('href' in target && target.href) {
        return;
      }

      if (event.key === 'Enter') {
        event.stopPropagation();
        event.preventDefault();
        setOpen(!open);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.stopPropagation();
        event.preventDefault();
        if (!isOpen) {
          setOpen(true);
          return;
        }

        setKeyboardSelectedIndex(0);
        setTimeout(() => {
          activeMenuItemRef.current?.focus();
        }, 10);
        return;
      }

      if (event.key === 'Tab' && !event.shiftKey && isOpen) {
        event.stopPropagation();
        event.preventDefault();
        setKeyboardSelectedIndex(0);
      }
    },
    [isOpen, open]
  );

  const handleMenuLinkKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown') {
        event.stopPropagation();
        event.preventDefault();
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
        event.stopPropagation();
        event.preventDefault();
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
        event.stopPropagation();
        event.preventDefault();
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
    (link: MenuItem | MenuLink) => (_event: MouseEvent) => {
      if (isMenuItem(link) && !open) {
        handleOpen();
        return;
      }

      handleClose();
    },
    [handleClose, handleOpen, open]
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

  const wrappedLink = useMemo(
    () => (
      <Button
        LinkComponent={!isEmpty(url) ? Link : undefined}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        target={!isEmpty(url) && url?.startsWith('http') ? '_blank' : undefined}
        href={!isEmpty(url) ? url : undefined}
        ref={buttonRef}
        onClick={handleOnClick(item)}
        onKeyDown={handleOnKeyDown}
        tabIndex={0}
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
          [getContainerQuery(theme.breakpoints.down('lg'), inCMS)]: {
            padding: '12px 12px 14px'
          },
          [getContainerQuery(theme.breakpoints.between('md', 1000), inCMS)]: {
            fontSize: '16px',
            padding: '12px 6px 14px'
          }
        }}
      >
        <StyledButtonTitle>{item.title}</StyledButtonTitle>
        {item.menu_links?.length ? (
          <ExpandMoreIcon
            fontSize="small"
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
    ),
    [debouncedIsOpen, handleOnClick, handleOnKeyDown, inCMS, item, selected, size, theme.breakpoints, url]
  );

  return (
    <StyledNavItem ref={wrapperRef} onMouseOver={handleOnMouseOver} onMouseOut={handleOnMouseOut}>
      {wrappedLink}
      {item.menu_links?.length && debouncedIsOpen ? (
        <NavItemPopup
          item={item}
          onClick={handleOnClick}
          onKeyDown={handleMenuLinkKeyDown}
          activeMenuItemRef={activeMenuItemRef}
          keyboardSelectedIndex={keyboardSelectedIndex}
        />
      ) : null}
    </StyledNavItem>
  );
};

export default NavItem;
