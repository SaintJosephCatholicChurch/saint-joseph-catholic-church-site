import format from 'date-fns/format';
import { useMemo } from 'react';
import { Bulletin } from '../../../../interface';

export function getFormattedBulletinDate(bulletin: Bulletin) {
  try {
    return format(new Date(bulletin.date), 'MMM dd, yyyy');
  } catch {
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

export function formatBulletinUrlDate(bulletin: Bulletin) {
  let date: string | undefined;

  try {
    date = format(new Date(bulletin.date), 'yyyy-MM-dd');
  } catch {
    date = '404';
  }

  return date;
}

export function useFormattedBulletinUrlDate(bulletin: Bulletin) {
  return useMemo(() => formatBulletinUrlDate(bulletin), [bulletin]);
}
