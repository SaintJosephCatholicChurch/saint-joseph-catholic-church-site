import addMinutes from "date-fns/addMinutes";
import format from "date-fns/format";

export function formatAsUtc(date: Date, formatString: string) {
  return format(addMinutes(date, date.getTimezoneOffset()), formatString);
}
