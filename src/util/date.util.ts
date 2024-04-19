import { addMinutes, format } from 'date-fns';

export function formatAsUtc(date: Date, formatString: string) {
  return format(addMinutes(date, date.getTimezoneOffset()), formatString);
}
