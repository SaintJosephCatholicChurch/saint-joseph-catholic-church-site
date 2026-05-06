import { ADMIN_AUTH, ADMIN_REPOSITORY, ADMIN_SESSION_KEYS, LEGACY_ADMIN_SESSION_KEYS } from '../adminConfig';
import { GitHubRepoClient } from './githubRepoClient';
import { NetlifyAuthError, NetlifyGitHubAuthenticator } from './netlifyGitHubAuth';

import type {
  AdminAuthAdapter,
  AdminAuthSession,
  AdminRepoClient,
  RepoDeleteInput,
  RepoDirectoryEntry,
  RepoMediaUploadInput,
  RepoTextFile,
  RepoWriteInput,
  RepoWriteResult,
  SessionStoreLike
} from './adminTypes';

type PreviewRepoRecord = {
  content: string;
  sha: string;
};

type CreatePreviewAdminBackendOptions = {
  initialFiles?: Record<string, string>;
  storage?: SessionStoreLike;
};

function serializeJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

const DEFAULT_PREVIEW_REPO_FILES: Record<string, string> = {
  'content/church_details.json': serializeJson({
    additional_emails: [],
    additional_phones: [],
    address: '1300 North Main Street',
    city: 'Bluffton',
    contacts: [
      {
        name: 'Fr. David Violi',
        title: 'Pastor'
      },
      {
        name: 'Michelle Paxton',
        title: 'Administrative Assistant'
      }
    ],
    email: 'stjosephchurch@adamswells.com',
    facebook_page: 'stjosephchurchbluffton',
    google_map_location: 'https://maps.google.com/?q=Saint+Joseph+Catholic+Church',
    mission_statement: 'We are a welcoming community of the people of God.',
    name: 'Saint Joseph Catholic Church',
    online_giving_url: 'https://www.osvhub.com/stjosephchurchbluffton/giving/funds',
    phone: '(260) 824-1380',
    state: 'Indiana',
    vision_statement: 'To prepare every parishioner to become an active participating Catholic Christian.',
    zipcode: '46714'
  }),
  'content/config.json': serializeJson({
    base_url: 'https://www.stjosephchurchbluffton.org/',
    posts_per_page: 5,
    privacy_policy_url: '/privacy-policy',
    site_description: 'Saint Joseph Catholic Church in Bluffton, Indiana.',
    site_image: '/files/homepage-image1.webp',
    site_keywords: ['catholic', 'church'],
    site_title: 'Saint Joseph Catholic Church'
  }),
  'content/homepage.json': serializeJson({
    daily_readings: {
      daily_readings_background: '/files/scripture-background.webp',
      subtitle: 'From The United States Conference Of Catholic Bishops (USCCB)',
      title: "Today's Readings"
    },
    daily_readings_background: '/files/scripture-background.webp',
    featured: [
      {
        image: '/files/synod-video.webp',
        summary: 'Bishop Rhoades opening announcement of the 2026 Diocesan Synod.',
        title: "Spreading the Fire of God's Love",
        type: 'featured_link',
        url: 'https://vimeo.com/1116880865'
      }
    ],
    invitation_text: 'Come Worship With Us',
    live_stream_button: {
      title: 'Live Stream Mass',
      url: '/live-stream'
    },
    newsletter: {
      bannerSubtitle: 'Via email and text messages',
      bannerTitle: 'Stay in touch with us',
      rssFeedUrl: 'https://api.stjosephchurchbluffton.org/.netlify/functions/flocknotes',
      signupButtonText: 'Click here to sign up',
      signupLink: 'https://stjosephcatholicchurch95.flocknote.com/'
    },
    schedule_section: {
      schedule_background: '/files/pattern.png',
      title: 'Weekly Schedule'
    },
    slides: [
      {
        image: '/files/homepage-image1.webp',
        title: 'All Are Welcome'
      },
      {
        image: '/files/homepage-image6.webp'
      }
    ]
  }),
  'content/menu.json': serializeJson({
    logo: {
      primary: 'St. Joseph',
      secondary: 'Catholic Church'
    },
    menu_items: [
      {
        title: 'Home',
        url: '/'
      },
      {
        title: 'Live Stream',
        url: '/live-stream'
      },
      {
        menu_links: [
          {
            title: 'Contact',
            url: '/contact'
          },
          {
            page: 'mass-confession-times',
            title: 'Mass & Confession Times'
          }
        ],
        title: 'Parish'
      }
    ],
    online_giving_button_text: 'Give'
  }),
  'content/staff.json': serializeJson({
    staff: [
      {
        name: 'Fr. David Violi',
        picture: '/staff/staff-photo-1.jpg',
        title: 'Pastor'
      },
      {
        name: 'Michelle Paxton',
        picture: '/staff/staff-photo-2.jpg',
        title: 'Administrative Assistant'
      }
    ]
  }),
  'content/styles.json': serializeJson({
    footer_background: '/files/footer-background.jpg'
  }),
  'content/meta/tags.json': serializeJson({
    tags: ['synod', 'community']
  }),
  'content/times.json': serializeJson({
    times: [
      {
        id: 'mass-times',
        name: 'Mass Times',
        sections: [
          {
            days: [
              {
                day: 'Saturday',
                id: 'sat-mass',
                times: [
                  {
                    end_time: '',
                    id: 'sat-mass-time',
                    notes: [
                      {
                        id: 'sat-note',
                        note: 'Rosary at 4:35 PM'
                      }
                    ],
                    time: '5:00 PM'
                  }
                ]
              },
              {
                day: 'Sunday',
                id: 'sun-mass',
                times: [
                  {
                    end_time: '',
                    id: 'sun-mass-time',
                    notes: [],
                    time: '10:00 AM'
                  }
                ]
              }
            ],
            id: 'weekend-mass-section',
            name: 'Weekend Mass'
          }
        ]
      },
      {
        id: 'office-hours',
        name: 'Parish Office Hours',
        sections: [
          {
            days: [
              {
                day: 'Monday - Friday',
                id: 'office-hours-day',
                times: [
                  {
                    end_time: '4:00 PM',
                    id: 'office-hours-time',
                    notes: [],
                    time: '9:00 AM'
                  }
                ]
              }
            ],
            id: 'office-hours-section',
            name: 'Office Hours'
          }
        ]
      }
    ]
  }),
  'content/pages/parish-history.mdx': `---
slug: parish-history
title: Parish History
date: 2024-03-12
---
<p>Saint Joseph Catholic Church has served Bluffton families for generations.</p>
<p>This record provides a read-only page view in the admin.</p>
`,
  'content/pages/youth-group.mdx': `---
slug: youth-group
title: Youth Group
date: 2022-09-02
---
<p>The St. Joseph Catholic Church Youth Group is a co-educational ministry for high school students.</p>
`,
  'content/posts/parish-mission.mdx': `---
slug: parish-mission
title: Parish Mission Week
image: /files/synod-video.webp
date: 2025-09-18
tags:
  - synod
---
<p>Join us for a week of parish mission talks, prayer, and fellowship.</p>
`,
  'content/posts/welcome-fr-david.mdx': `---
slug: welcome-fr-david
title: Welcome Fr. David!
image: /files/welcome-fr-david.webp
date: 2018-07-13
---
<p>Welcome to our Parish Family, Fr. David!</p>
`,
  'content/bulletins/2026-04-26.json': serializeJson({
    date: '2026-04-26',
    name: 'Second Sunday of Easter',
    pdf: '/bulletins/second-sunday-of-easter-2026.pdf'
  }),
  'content/bulletins/2026-05-03.json': serializeJson({
    date: '2026-05-03',
    name: 'Fifth Sunday of Easter',
    pdf: '/bulletins/fifth-sunday-of-easter-2026.pdf'
  }),
  'public/bulletins/fifth-sunday-of-easter-2026.pdf': 'preview bulletin asset',
  'public/bulletins/second-sunday-of-easter-2026.pdf': 'preview bulletin asset',
  'public/files/footer-background.jpg': 'preview shared media',
  'public/files/homepage-image1.webp': 'preview shared media',
  'public/files/homepage-image6.webp': 'preview shared media',
  'public/files/pattern.png': 'preview shared media',
  'public/files/scripture-background.webp': 'preview shared media',
  'public/files/synod-video.webp': 'preview shared media',
  'public/files/welcome-fr-david.webp': 'preview shared media',
  'public/staff/staff-photo-1.jpg': 'preview staff media',
  'public/staff/staff-photo-2.jpg': 'preview staff media'
};

function createSha(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function normalizePath(path: string) {
  return path.replace(/^\/+|\/+$/g, '');
}

function getDefaultBrowserStorage(): SessionStoreLike | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function readStoredSession(storage: SessionStoreLike | null, key: string) {
  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(key);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AdminAuthSession;
  } catch {
    storage.removeItem(key);
    return null;
  }
}

function writeStoredSession(storage: SessionStoreLike | null, key: string, session: AdminAuthSession | null) {
  if (!storage) {
    return;
  }

  if (!session) {
    storage.removeItem(key);
    return;
  }

  storage.setItem(key, JSON.stringify(session));
}

function clearStoredSessions(storage: SessionStoreLike | null, keys: string[]) {
  if (!storage) {
    return;
  }

  for (const key of keys) {
    storage.removeItem(key);
  }
}

function readStoredSessionFromKeys(storage: SessionStoreLike | null, keys: string[]) {
  for (const key of keys) {
    const session = readStoredSession(storage, key);
    if (session) {
      return session;
    }
  }

  return null;
}

function joinParentPath(path: string) {
  const normalizedPath = normalizePath(path);
  const lastSlashIndex = normalizedPath.lastIndexOf('/');

  if (lastSlashIndex === -1) {
    return '';
  }

  return normalizedPath.slice(0, lastSlashIndex);
}

function joinChildPath(parentPath: string, childPath: string) {
  if (!parentPath) {
    return childPath;
  }

  return `${parentPath}/${childPath}`;
}

class PreviewRepoClient implements AdminRepoClient {
  private files: Map<string, PreviewRepoRecord>;
  private repo: string;
  private branch: string;

  constructor({ branch, initialFiles, repo }: { branch: string; initialFiles: Record<string, string>; repo: string }) {
    this.branch = branch;
    this.repo = repo;
    this.files = new Map(
      Object.entries(initialFiles).map(([path, content]) => [normalizePath(path), { content, sha: createSha('preview') }])
    );
  }

  getRepoLabel() {
    return `${this.repo}@${this.branch} (preview)`;
  }

  listFiles(path: string): Promise<RepoDirectoryEntry[]> {
    const normalizedFolder = normalizePath(path);
    const entries = new Map<string, RepoDirectoryEntry>();

    for (const [storedPath, record] of this.files.entries()) {
      const parentPath = joinParentPath(storedPath);
      if (normalizedFolder && !storedPath.startsWith(`${normalizedFolder}/`) && storedPath !== normalizedFolder) {
        continue;
      }

      const relativePath = normalizedFolder ? storedPath.slice(normalizedFolder.length).replace(/^\//, '') : storedPath;
      if (!relativePath) {
        entries.set(storedPath, {
          name: storedPath.split('/').pop() || storedPath,
          path: storedPath,
          sha: record.sha,
          size: record.content.length,
          type: 'file'
        });
        continue;
      }

      const [firstSegment, ...remainingSegments] = relativePath.split('/');
      const entryPath = joinChildPath(normalizedFolder, firstSegment);

      if (remainingSegments.length === 0 && parentPath === normalizedFolder) {
        entries.set(entryPath, {
          name: firstSegment,
          path: entryPath,
          sha: record.sha,
          size: record.content.length,
          type: 'file'
        });
        continue;
      }

      if (!entries.has(entryPath)) {
        entries.set(entryPath, {
          name: firstSegment,
          path: entryPath,
          type: 'dir'
        });
      }
    }
    return Promise.resolve([...entries.values()].sort((left, right) => left.path.localeCompare(right.path)));
  }

  readTextFile(path: string): Promise<RepoTextFile> {
    const normalizedPath = normalizePath(path);
    const file = this.files.get(normalizedPath);

    if (!file) {
      return Promise.reject(new Error(`Fake repo file not found: ${normalizedPath}`));
    }

    return Promise.resolve({
      content: file.content,
      path: normalizedPath,
      sha: file.sha
    });
  }

  writeTextFile(input: RepoWriteInput): Promise<RepoWriteResult> {
    const normalizedPath = normalizePath(input.path);
    const sha = createSha('preview');

    this.files.set(normalizedPath, {
      content: input.content,
      sha
    });
    return Promise.resolve({
      commitSha: createSha('commit'),
      path: normalizedPath,
      sha
    });
  }

  deleteFile(input: RepoDeleteInput): Promise<void> {
    const normalizedPath = normalizePath(input.path);

    if (!this.files.has(normalizedPath)) {
      return Promise.reject(new Error(`Fake repo file not found: ${normalizedPath}`));
    }

    this.files.delete(normalizedPath);
    return Promise.resolve();
  }

  async uploadMedia(input: RepoMediaUploadInput): Promise<RepoWriteResult> {
    const normalizedPath = normalizePath(input.path);
    const sha = createSha('fake-media');

    this.files.set(normalizedPath, {
      content: await input.file.text(),
      sha
    });

    return {
      commitSha: createSha('commit'),
      path: normalizedPath,
      sha
    };
  }
}

export function createMemorySessionStore(): SessionStoreLike {
  const store = new Map<string, string>();

  return {
    getItem(key) {
      return store.get(key) || null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, value);
    }
  };
}

export function createPreviewAdminBackend(options: CreatePreviewAdminBackendOptions = {}): AdminAuthAdapter {
  const storage = options.storage || getDefaultBrowserStorage() || createMemorySessionStore();
  const repoClient = new PreviewRepoClient({
    branch: ADMIN_REPOSITORY.branch,
    initialFiles: {
      ...DEFAULT_PREVIEW_REPO_FILES,
      ...(options.initialFiles || {})
    },
    repo: ADMIN_REPOSITORY.repo
  });

  const createSession = (): AdminAuthSession => ({
    branch: ADMIN_REPOSITORY.branch,
    mode: 'preview',
    repo: ADMIN_REPOSITORY.repo,
    restoredAt: new Date().toISOString(),
    token: 'preview-admin-token',
    user: {
      avatarUrl: 'https://example.com/fake-user.png',
      htmlUrl: 'https://github.com/stjosephchurch-admin',
      login: 'stjosephchurch-admin',
      name: 'Admin Tester'
    }
  });

  return {
    mode: 'preview',
    createRepoClient() {
      return repoClient;
    },
    login() {
      const session = createSession();
      clearStoredSessions(storage, [ADMIN_SESSION_KEYS.preview, LEGACY_ADMIN_SESSION_KEYS.preview]);
      writeStoredSession(storage, ADMIN_SESSION_KEYS.preview, session);
      return Promise.resolve(session);
    },
    logout() {
      clearStoredSessions(storage, [ADMIN_SESSION_KEYS.preview, LEGACY_ADMIN_SESSION_KEYS.preview]);
      return Promise.resolve();
    },
    restoreSession() {
      const session = readStoredSessionFromKeys(storage, [ADMIN_SESSION_KEYS.preview, LEGACY_ADMIN_SESSION_KEYS.preview]);

      if (session) {
        clearStoredSessions(storage, [LEGACY_ADMIN_SESSION_KEYS.preview]);
        writeStoredSession(storage, ADMIN_SESSION_KEYS.preview, session);
      }

      return Promise.resolve(session);
    }
  };
}

export function createConnectedAdminBackend(
  storage: SessionStoreLike | null = getDefaultBrowserStorage()
): AdminAuthAdapter {
  const authenticator = new NetlifyGitHubAuthenticator({
    authEndpoint: ADMIN_AUTH.authEndpoint,
    baseUrl: ADMIN_AUTH.baseUrl,
    siteId: ADMIN_AUTH.siteId
  });

  const createRepoClient = (session: AdminAuthSession) =>
    new GitHubRepoClient({
      apiRoot: ADMIN_REPOSITORY.apiRoot,
      branch: session.branch,
      repo: session.repo,
      token: session.token
    });

  const buildSession = async (token: string) => {
    const repoClient = new GitHubRepoClient({
      apiRoot: ADMIN_REPOSITORY.apiRoot,
      branch: ADMIN_REPOSITORY.branch,
      repo: ADMIN_REPOSITORY.repo,
      token
    });

    const [user, hasWriteAccess] = await Promise.all([repoClient.getCurrentUser(), repoClient.hasWriteAccess()]);

    if (!hasWriteAccess) {
      throw new Error('Your GitHub account does not have push access to the site repository.');
    }

    const session: AdminAuthSession = {
      branch: ADMIN_REPOSITORY.branch,
      mode: 'connected',
      repo: ADMIN_REPOSITORY.repo,
      restoredAt: new Date().toISOString(),
      token,
      user
    };

    writeStoredSession(storage, ADMIN_SESSION_KEYS.connected, session);
    return session;
  };

  return {
    mode: 'connected',
    createRepoClient,
    async login() {
      const authResponse = await authenticator.authenticate({
        provider: 'github',
        scope: ADMIN_AUTH.authScope || undefined
      });

      if (!authResponse.token) {
        throw new NetlifyAuthError('GitHub authentication completed without a token.');
      }

      return buildSession(authResponse.token);
    },
    logout() {
      clearStoredSessions(storage, [ADMIN_SESSION_KEYS.connected, LEGACY_ADMIN_SESSION_KEYS.connected]);
      return Promise.resolve();
    },
    async restoreSession() {
      const storedSession = readStoredSessionFromKeys(storage, [
        ADMIN_SESSION_KEYS.connected,
        LEGACY_ADMIN_SESSION_KEYS.connected
      ]);

      if (!storedSession?.token) {
        return null;
      }

      try {
        return await buildSession(storedSession.token);
      } catch {
        clearStoredSessions(storage, [ADMIN_SESSION_KEYS.connected, LEGACY_ADMIN_SESSION_KEYS.connected]);
        return null;
      }
    }
  };
}
