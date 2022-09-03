import format from 'date-fns/format';
import { useMemo } from 'react';
import { Bulletin } from '../../../../interface';

export function getFormattedBulletinTitle(bulletin: Bulletin) {
  let date: string | undefined;

  try {
    date = format(new Date(bulletin.date), 'MMM dd, yyyy');
  } catch {
    date = 'N/A';
  }

  const name = bulletin.name ? ` - ${bulletin.name}` : '';

  return `${date}${name}`;
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
