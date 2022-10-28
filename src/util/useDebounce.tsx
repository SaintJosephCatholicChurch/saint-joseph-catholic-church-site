import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      if (delay <= 0) {
        setDebouncedValue(value);
        return;
      }

      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return delay <= 0 ? value : debouncedValue;
}

export function useDebouncedToggleOff(value: boolean, delay: number) {
  const [toggleValue, setToggleValue] = useState(value);

  const debouncedValue = useDebounce(value, delay);

  useEffect(
    () => {
      if (delay <= 0 || value) {
        setToggleValue(value);
        return;
      }

      // Update debounced value after delay
      const handler = setTimeout(() => {
        setToggleValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return toggleValue || debouncedValue;
}

export function useDebouncedToggleOn(value: boolean, delay: number) {
  return !useDebouncedToggleOff(!value, delay);
}

