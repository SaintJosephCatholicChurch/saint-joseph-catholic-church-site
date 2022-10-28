import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import transientOptions from '../../util/transientOptions';
import useElementSize from '../../util/useElementSize';
import useWindowSize from '../../util/useWindowSize';
import NavLink from './NavLink';

import type { KeyboardEvent, MouseEvent, MutableRefObject } from 'react';
import type { MenuItem, MenuLink } from '../../interface';
import type { HoverState } from './NavItem';

const BUFFER = 5;
const SCROLL_BAR_OFFSET = 15;

interface StyledPopUpMenuProps {
  $offsetX: number;
}

const StyledPopUpMenu = styled(
  'div',
  transientOptions
)<StyledPopUpMenuProps>(
  ({ $offsetX }) => `
    position: absolute;
    display: flex;
    flex-direction: column;
    background: #f2f2f2;
    box-shadow: 2px 2px 2px 0 rgb(0 0 0 / 3%);
    top: 52px;
    left: ${$offsetX}px;
    z-index: 900;
    border-radius: 4px;
  `
);

interface NavItemPopupProps {
  item: MenuItem;
  onClick: (link: MenuItem | MenuLink, type: keyof HoverState) => (_event: MouseEvent) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseOver: (type: keyof HoverState) => () => void;
  onMouseOut: (type: keyof HoverState) => () => void;
  activeMenuItemRef: MutableRefObject<HTMLButtonElement>;
  keyboardSelectedIndex: number;
}

const NavItemPopup = ({
  item,
  onClick,
  onKeyDown,
  onMouseOut,
  onMouseOver,
  activeMenuItemRef,
  keyboardSelectedIndex
}: NavItemPopupProps) => {
  const { width: windowWidth } = useWindowSize();
  const [ref, { width, x }] = useElementSize();

  const offsetX = useMemo(() => {
    if (x - BUFFER < 0) {
      return -(x - BUFFER);
    }

    if (x + width + SCROLL_BAR_OFFSET + BUFFER > windowWidth) {
      return windowWidth - (x + width + SCROLL_BAR_OFFSET + BUFFER);
    }

    return 0;
  }, [width, windowWidth, x]);

  return (
    <StyledPopUpMenu $offsetX={offsetX} ref={ref} onMouseOver={onMouseOver('menu')} onMouseOut={onMouseOut('menu')}>
      {item.menu_links.map((link, index) => (
        <NavLink
          ref={index === keyboardSelectedIndex ? activeMenuItemRef : undefined}
          key={`menu-${item.title}-link-${link.title}`}
          link={link}
          onClick={onClick(link, 'menu')}
          onKeyDown={onKeyDown}
        />
      ))}
    </StyledPopUpMenu>
  );
};

export default NavItemPopup;
