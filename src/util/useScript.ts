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
      const windowWithNamedExports = window as unknown as Record<string, unknown>;
      setLib({ [name]: (windowWithNamedExports[name] as T | undefined) ?? null });
      setLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, name, loadNow]);

  return { script: lib[name], loaded };
};
