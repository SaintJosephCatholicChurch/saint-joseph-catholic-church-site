import { useEffect, useMemo } from 'react';

interface CollectionIcon {
  name: string;
  icon: string;
}

function iconify(icons: CollectionIcon[]) {
  icons.forEach(function (item) {
    const loc = document.querySelector(`a[data-testid="${item.name}"] span`);
    const i = document.createElement('i');

    i.style.width = '24px';
    i.style.height = '24px';
    i.style.display = 'flex';
    i.style.alignItems = 'center';
    i.style.justifyContent = 'center';

    i.classList.add(...item.icon.split(' '));
    i.setAttribute('aria-hidden', 'true');
    if (loc) {
      while (loc.firstChild) {
        loc.removeChild(loc.firstChild);
      }
      loc.appendChild(i);
    }
  });
}

export default function useCollectionIcons(icons: CollectionIcon[]) {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      iconify(icons);
    });

    const init = new MutationObserver(() => {
      const exists = !!document.querySelector('#nc-root');

      if (exists) {
        iconify(icons);
        observer.observe(document.querySelector('#nc-root'), {
          childList: true
        });
        init.disconnect();
      }
    });

    init.observe(document.querySelector('body'), {
      childList: true
    });
  }, [icons]);
}
