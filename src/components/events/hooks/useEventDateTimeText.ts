import addSeconds from 'date-fns/addSeconds';
import differenceInDays from 'date-fns/differenceInDays';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import { useMemo } from 'react';

import { isNullish } from '../../../util/null.util';

export default function useEventDateTimeText(
  start: Date | null | undefined,
  end: Date | null | undefined,
  allDay: boolean
): [string, string | undefined] {
  return useMemo(() => {
    if (isNullish(start)) {
      return ['', undefined];
    }

    if (isNullish(end)) {
      if (allDay) {
        return [format(start, 'EEEE, MMMM d, yyyy'), undefined];
      }
      return [format(start, 'EEEE, MMMM d, yyyy'), format(start, 'h:mm aaa')];
    }

    if (isSameDay(start, end)) {
      if (allDay) {
        return [format(start, 'EEEE, MMMM d, yyyy'), undefined];
      }
      return [format(start, 'EEEE, MMMM d, yyyy'), `${format(start, 'h:mm aaa')} - ${format(end, 'h:mm aaa')}`];
    }

    if (
      start.getHours() === end.getHours() &&
      start.getMinutes() == end.getMinutes() &&
      differenceInDays(end, start) === 1
    ) {
      return [format(start, 'EEEE, MMMM d, yyyy'), undefined];
    }

    if (allDay) {
      if (isSameMonth(start, end)) {
        return [`${format(start, 'MMMM d')} - ${format(addSeconds(end, -1), 'd, yyyy')}`, undefined];
      }

      if (isSameYear(start, end)) {
        return [`${format(start, 'MMMM d')} - ${format(addSeconds(end, -1), 'MMMM d, yyyy')}`, undefined];
      }

      return [`${format(start, 'MMMM d, yyyy')} - ${format(addSeconds(end, -1), 'MMMM d, yyyy')}`, undefined];
    }

    return [
      `${format(start, 'MMMM d, yyyy, h:mm aaa')} - ${format(addSeconds(end, -1), 'MMMM d, yyyy, h:mm aaa')}`,
      undefined
    ];
  }, [start, end, allDay]);
}
