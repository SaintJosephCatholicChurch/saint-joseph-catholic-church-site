import { useMemo } from "react";

export default function useLocation(): Partial<Location> {
  if (typeof window === "undefined") {
    return {};
  }

  return useMemo(() => window?.location, [window?.location]);
}
