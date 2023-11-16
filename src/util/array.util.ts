export function arrayMoveImmutable<T>(array: T[], oldIndex: number, newIndex: number): T[] {
  const newArray = [...array];

  newArray.splice(newIndex, 0, newArray.splice(oldIndex, 1)[0]);

  return newArray;
}
