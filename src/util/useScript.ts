import { useState, useEffect } from "react";

export const useScript = <T extends unknown = unknown>(url: string, name: string = 'default', loadNow = true): { script: T | null, loaded: boolean } => {
  const [lib, setLib] = useState<Record<string, T | null>>({ [name]: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loadNow) {
      return;
    }

    const script = document.createElement("script");

    script.src = url;
    script.async = true;
    script.onload = () => {
      setLib({ [name]: window[name as any] as T });
      setLoaded(true);
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, name, loadNow]);

  return { script: lib[name] as T, loaded };
};
