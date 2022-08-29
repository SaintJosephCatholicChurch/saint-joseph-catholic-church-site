import { useCallback, useEffect, useState } from 'react';

interface StyleCopyProps {
  document: Document;
}

const StyleCopy = ({ document }: StyleCopyProps) => {
  const [styles, setStyles] = useState<HTMLStyleElement[]>([]);

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
  
  useEffect(() => {
    const timer = setTimeout(() => {
      getStyles();
    }, 250);
    return () => clearTimeout(timer);
  }, [getStyles]);

  useEffect(() => {
    if (parent) {
      const oHead = document.getElementsByTagName('head')[0];
      styles.forEach((style) => oHead.appendChild(style));

      return () => {
        styles.forEach((style) => oHead.removeChild(style));
      };
    }

    return () => {};
  }, [document, styles]);

  return null;
};

export default StyleCopy;
