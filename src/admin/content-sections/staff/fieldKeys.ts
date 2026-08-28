const STAFF_FIELDS = ['name', 'picture', 'title'] as const;

export type StaffFieldName = (typeof STAFF_FIELDS)[number];
export type StaffFieldKey = `staff|${string}|${StaffFieldName}`;

export function createStaffFieldKey(clientId: string, field: StaffFieldName): StaffFieldKey {
  return `staff|${clientId}|${field}`;
}

export function parseStaffFieldKey(fieldKey: string) {
  const [prefix, rawClientId, rawField] = fieldKey.split('|');

  if (prefix !== 'staff' || !rawClientId || !rawField || !STAFF_FIELDS.includes(rawField as StaffFieldName)) {
    return null;
  }

  return {
    clientId: rawClientId,
    field: rawField as StaffFieldName
  };
}
