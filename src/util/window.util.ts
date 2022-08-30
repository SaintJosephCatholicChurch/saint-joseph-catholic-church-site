/* eslint-disable max-classes-per-file */
import { useEffect } from 'react';
import ScheduleTabChangeEvent from './events/ScheduleTabChangeEvent';

interface EventMap {
  scheduleTabChange: ScheduleTabChangeEvent;
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  eventName: K,
  callback: (event: WindowEventMap[K]) => void,
  targetWindow?: Window & typeof globalThis
): void;
export function useWindowEvent<K extends keyof EventMap>(
  eventName: K,
  callback: (event: EventMap[K]) => void,
  targetWindow?: Window & typeof globalThis
): void;
export function useWindowEvent(
  eventName: string,
  callback: EventListenerOrEventListenerObject,
  targetWindow: Window & typeof globalThis = window
): void {
  useEffect(() => {
    targetWindow.addEventListener(eventName, callback);

    return () => {
      targetWindow.removeEventListener(eventName, callback);
    };
  });
}
