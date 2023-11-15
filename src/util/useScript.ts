import { useState, useEffect } from 'react';

export const useScript = <T = unknown>(
  url: string,
  name = 'default',
  loadNow = true
): { script: T | null; loaded: boolean } => {
  const [lib, setLib] = useState<Record<string, T | null>>({ [name]: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loadNow) {
      return;
    }

    const script = document.createElement('script');

    script.src = url;
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      setLib({ [name]: window[name as any] as unknown as T });
      setLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, name, loadNow]);

  return { script: lib[name], loaded };
};
