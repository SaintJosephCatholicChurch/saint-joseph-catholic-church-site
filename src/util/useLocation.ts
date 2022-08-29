/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

export default function useLocation(): Partial<Location> {
  if (typeof window === 'undefined') {
    return {};
  }
  return window?.location;
}
