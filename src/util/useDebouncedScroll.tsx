import { MutableRefObject, useMemo, useState } from 'react';
import useEventListener from './useEventListener';

export default function useDebouncedScroll(
  ref: MutableRefObject<HTMLElement>,
  direction: 'vertical' | 'horizontal' = 'vertical',
  delay = 100
) {
  const [debouncedValue, setDebouncedValue] = useState(ref.current?.scrollLeft ?? 0);
  const scrollVariable = useMemo(() => (direction === 'vertical' ? 'scrollTop' : 'scrollLeft'), [direction]);

  let scrolling = false;
  let timer: NodeJS.Timeout | undefined;
  const debounceScroll = (currentScroll: number) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      const newScroll = ref.current?.[scrollVariable] ?? 0;
      if (!scrolling && currentScroll === newScroll) {
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
    scrolling = false;
    handleScroll();
  };

  const handleScrollStart = () => {
    scrolling = true;
  };

  useEventListener('mouseup', handleScroll, ref);
  useEventListener('touchstart', handleScrollStart, ref);
  useEventListener('touchend', handleScrollEnd, ref);
  useEventListener('scroll', handleScroll, ref);

  return debouncedValue;
}
