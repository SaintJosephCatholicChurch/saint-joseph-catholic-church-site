export const ADMIN_PREVIEW_FIELD_KEY_ATTRIBUTE = 'data-admin-field-key';
export const ADMIN_HOMEPAGE_MASS_TIMES_ATTRIBUTE = 'data-admin-homepage-mass-times-target';

export const ADMIN_PREVIEW_TARGET_STYLE = {
  backgroundColor: 'rgba(188, 47, 59, 0.1)',
  borderRadius: '4px',
  boxShadow: 'inset 0 0 0 1px rgba(127, 35, 44, 0.24)'
} as const;

export function getAdminPreviewFieldTargetProps(fieldKey?: string | null) {
  return fieldKey ? ({ [ADMIN_PREVIEW_FIELD_KEY_ATTRIBUTE]: fieldKey } as Record<string, string>) : {};
}

export function getActiveAdminPreviewTargetStyle(fieldKey: string | undefined, activeFieldKey?: string) {
  return fieldKey && activeFieldKey === fieldKey ? ADMIN_PREVIEW_TARGET_STYLE : undefined;
}
