import { useState, useCallback } from "react";
import { useScript } from "./useScript";

export const useDeferredScript = <T extends unknown = unknown>(
  url: string,
  name: string = "default"
): { script: T | null; loaded: boolean; load: () => void } => {
  const [loadNow, setLoadNow] = useState(false);
  const { script, loaded } = useScript<T>(url, name, loadNow);

  const load = useCallback(() => {
    setLoadNow(true);
  }, []);

  return { script, loaded, load };
};
