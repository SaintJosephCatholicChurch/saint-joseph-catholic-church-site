const STAFF_FIELDS = ['name', 'picture', 'title'] as const;

export type StaffFieldName = (typeof STAFF_FIELDS)[number];
export type StaffFieldKey = `staff|${number}|${StaffFieldName}`;

export function createStaffFieldKey(index: number, field: StaffFieldName): StaffFieldKey {
  return `staff|${index}|${field}`;
}

export function parseStaffFieldKey(fieldKey: string) {
  const [prefix, rawIndex, rawField] = fieldKey.split('|');

  if (prefix !== 'staff' || !rawIndex || !rawField || !STAFF_FIELDS.includes(rawField as StaffFieldName)) {
    return null;
  }

  const index = Number.parseInt(rawIndex, 10);

  if (Number.isNaN(index)) {
    return null;
  }

  return {
    field: rawField as StaffFieldName,
    index
  };
}
