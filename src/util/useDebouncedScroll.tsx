import { useEffect, useMemo, useRef, useState } from 'react';

import useEventListener from './useEventListener';

import type { MutableRefObject } from 'react';

export default function useDebouncedScroll(
  ref: MutableRefObject<HTMLElement>,
  direction: 'vertical' | 'horizontal' = 'vertical',
  delay = 100
) {
  const [debouncedValue, setDebouncedValue] = useState(ref.current?.scrollLeft ?? 0);
  const scrollVariable = useMemo(() => (direction === 'vertical' ? 'scrollTop' : 'scrollLeft'), [direction]);
  const scrollingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const debounceScroll = (currentScroll: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const newScroll = ref.current?.[scrollVariable] ?? 0;
      if (!scrollingRef.current && currentScroll === newScroll) {
        setDebouncedValue(currentScroll);
      } else {
        debounceScroll(newScroll);
      }
    }, delay);
  };

  const handleScroll = () => {
    debounceScroll(ref.current?.[scrollVariable] ?? 0);
  };

  const handleScrollEnd = () => {
    scrollingRef.current = false;
    handleScroll();
  };

  const handleScrollStart = () => {
    scrollingRef.current = true;
  };

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  useEventListener('mouseup', handleScroll, ref);
  useEventListener('touchstart', handleScrollStart, ref);
  useEventListener('touchend', handleScrollEnd, ref);
  useEventListener('scroll', handleScroll, ref);

  return debouncedValue;
}
