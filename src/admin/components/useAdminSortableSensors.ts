'use client';

import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export function useAdminSortableSensors() {
  return useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
}
