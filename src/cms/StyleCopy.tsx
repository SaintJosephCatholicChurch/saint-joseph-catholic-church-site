import { ReactNode, useCallback, useState } from 'react';
import useIsomorphicLayoutEffect from '../util/useIsomorphicLayoutEffect';

interface StyleCopyProps {
  document: Document;
  children?: ReactNode;
}

const StyleCopy = ({ document, children }: StyleCopyProps) => {
  const [styles, setStyles] = useState<HTMLStyleElement[]>([]);
  const [show, setShow] = useState(false);

  const getStyles = useCallback(() => {
    if (typeof window === undefined) {
      return;
    }

    if (parent) {
      const arrStyleSheets = parent.document.getElementsByTagName('style');
      if (arrStyleSheets.length === styles.length) {
        return;
      }

      const newStyles: HTMLStyleElement[] = [];
      for (let i = 0; i < arrStyleSheets.length; i++) {
        newStyles.push(arrStyleSheets[i].cloneNode(true) as HTMLStyleElement);
      }
      setStyles(newStyles);
    }
  }, [styles.length]);

  useIsomorphicLayoutEffect(() => {
    const timer = setTimeout(() => {
      getStyles();
    }, 250);
    return () => clearTimeout(timer);
  }, [getStyles]);

  useIsomorphicLayoutEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (parent) {
      const oHead = document.getElementsByTagName('head')[0];
      styles.forEach((style) => oHead.appendChild(style));

      return () => {
        styles.forEach((style) => oHead.removeChild(style));
      };
    }

    return () => {};
  }, [document, styles]);

  return <div style={!show ? { visibility: 'hidden' } : {}}>{children}</div>;
};

export default StyleCopy;
