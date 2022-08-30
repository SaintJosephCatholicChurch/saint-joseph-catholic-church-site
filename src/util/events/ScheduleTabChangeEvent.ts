export default class ScheduleTabChangeEvent extends CustomEvent<number> {
  constructor(index: number) {
    super('scheduleTabChange', { detail: index });
  }
}
