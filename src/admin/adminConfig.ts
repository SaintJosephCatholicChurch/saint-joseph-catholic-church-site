export const ADMIN_REPOSITORY = {
  repo: 'SaintJosephCatholicChurch/saint-joseph-catholic-church-site',
  branch: 'main',
  apiRoot: 'https://api.github.com'
} as const;

export const ADMIN_AUTH = {
  baseUrl: 'https://api.netlify.com',
  authEndpoint: 'auth',
  authScope: 'repo',
  siteId: ''
} as const;

export const ADMIN_SESSION_KEYS = {
  connected: 'site-admin-connected-session',
  preview: 'site-admin-preview-session'
} as const;

export const LEGACY_ADMIN_SESSION_KEYS = {
  connected: 'site-admin-migration-connected-session',
  preview: 'site-admin-migration-preview-session'
} as const;

export const ADMIN_READ_PROBE = {
  filePath: 'content/config.json',
  folderPath: 'content'
} as const;
