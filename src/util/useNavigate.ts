import { useCallback, useMemo } from "react";

export default function useNavigate() {
  return useCallback((url: string) => {
    window.location.assign(url);
  }, []);
}
