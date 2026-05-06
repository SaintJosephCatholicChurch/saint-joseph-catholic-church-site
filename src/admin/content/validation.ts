export type UnknownRecord = Record<string, unknown>;

function formatPath(parentPath: string, property: string) {
  return `${parentPath}.${property}`;
}

export function expectArray<T>(value: unknown, label: string, mapItem: (item: unknown, index: number) => T): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  return value.map((item, index) => mapItem(item, index));
}

export function expectArrayProperty<T>(
  record: UnknownRecord,
  property: string,
  label: string,
  mapItem: (item: unknown, index: number) => T
): T[] {
  return expectArray(record[property], formatPath(label, property), mapItem);
}

export function expectLiteral<T extends string>(value: unknown, label: string, allowedValues: readonly T[]): T {
  if (typeof value !== 'string' || !allowedValues.includes(value as T)) {
    throw new Error(`${label} must be one of ${allowedValues.join(', ')}.`);
  }

  return value as T;
}

export function expectNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${label} must be a number.`);
  }

  return value;
}

export function expectNumberProperty(record: UnknownRecord, property: string, label: string): number {
  return expectNumber(record[property], formatPath(label, property));
}

export function expectOptionalArray<T>(
  value: unknown,
  label: string,
  mapItem: (item: unknown, index: number) => T
): T[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return expectArray(value, label, mapItem);
}

export function expectOptionalArrayProperty<T>(
  record: UnknownRecord,
  property: string,
  label: string,
  mapItem: (item: unknown, index: number) => T
): T[] | undefined {
  return expectOptionalArray(record[property], formatPath(label, property), mapItem);
}

export function expectOptionalRecord(value: unknown, label: string): UnknownRecord | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return expectRecord(value, label);
}

export function expectOptionalRecordProperty(
  record: UnknownRecord,
  property: string,
  label: string
): UnknownRecord | undefined {
  return expectOptionalRecord(record[property], formatPath(label, property));
}

export function expectOptionalString(value: unknown, label: string): string | undefined {
  if (value === undefined || value === null || value === '') {
    return value === '' ? '' : undefined;
  }

  return expectString(value, label);
}

export function expectOptionalStringProperty(
  record: UnknownRecord,
  property: string,
  label: string
): string | undefined {
  return expectOptionalString(record[property], formatPath(label, property));
}

export function expectOptionalStringArray(value: unknown, label: string): string[] | undefined {
  return expectOptionalArray(value, label, (item, index) => expectString(item, `${label}[${index}]`));
}

export function expectOptionalStringArrayProperty(
  record: UnknownRecord,
  property: string,
  label: string
): string[] | undefined {
  return expectOptionalStringArray(record[property], formatPath(label, property));
}

export function expectRecord(value: unknown, label: string): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value as UnknownRecord;
}

export function expectRecordProperty(record: UnknownRecord, property: string, label: string): UnknownRecord {
  return expectRecord(record[property], formatPath(label, property));
}

export function expectString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${label} must be a string.`);
  }

  return value;
}

export function expectStringArray(value: unknown, label: string): string[] {
  return expectArray(value, label, (item, index) => expectString(item, `${label}[${index}]`));
}

export function expectStringArrayProperty(record: UnknownRecord, property: string, label: string): string[] {
  return expectStringArray(record[property], formatPath(label, property));
}

export function expectStringProperty(record: UnknownRecord, property: string, label: string): string {
  return expectString(record[property], formatPath(label, property));
}
