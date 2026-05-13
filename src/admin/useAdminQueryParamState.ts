'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface UseAdminQueryParamStateOptions<TValue extends string> {
  allowedValues: readonly TValue[];
  clearWhenDefault?: boolean;
  defaultValue: TValue;
  paramName: string;
}

export function useAdminQueryParamState<TValue extends string>({
  allowedValues,
  clearWhenDefault = true,
  defaultValue,
  paramName
}: UseAdminQueryParamStateOptions<TValue>): readonly [TValue, (nextValue: TValue) => void] {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    const rawValue = searchParams.get(paramName);

    if (!rawValue) {
      return defaultValue;
    }

    return allowedValues.includes(rawValue as TValue) ? (rawValue as TValue) : defaultValue;
  }, [allowedValues, defaultValue, paramName, searchParams]);

  const setValue = useCallback(
    (nextValue: TValue) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (clearWhenDefault && nextValue === defaultValue) {
        nextParams.delete(paramName);
      } else {
        nextParams.set(paramName, nextValue);
      }

      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [clearWhenDefault, defaultValue, paramName, pathname, router, searchParams]
  );

  return [value, setValue] as const;
}
