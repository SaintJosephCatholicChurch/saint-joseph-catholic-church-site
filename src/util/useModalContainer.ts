import { useLayoutEffect, useState } from 'react';

export default function useModalContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const drawerContainer = window.document.getElementById('drawer-container');

    setContainer(drawerContainer ? drawerContainer : window.document.body);
  }, []);

  return container;
}
