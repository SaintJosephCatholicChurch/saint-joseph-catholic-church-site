import { format, parse } from 'date-fns';
import { useMemo } from 'react';

import type { Bulletin } from '../../../../interface';

export function getFormattedBulletinDate(bulletin: Bulletin) {
  try {
    return format(parse(bulletin.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
  } catch (e) {
    return 'N/A';
  }
}

export function useFormattedBulletinDate(bulletin: Bulletin) {
  return useMemo(() => getFormattedBulletinDate(bulletin), [bulletin]);
}

export function getFormattedBulletinTitle(bulletin: Bulletin) {
  return `${getFormattedBulletinDate(bulletin)}${bulletin.name ? ` - ${bulletin.name}` : ''}`;
}

export function useFormattedBulletinTitle(bulletin: Bulletin) {
  return useMemo(() => getFormattedBulletinTitle(bulletin), [bulletin]);
}

export function useFormattedBulletinUrlDate(bulletin: Bulletin) {
  return useMemo(() => bulletin.date, [bulletin.date]);
}
