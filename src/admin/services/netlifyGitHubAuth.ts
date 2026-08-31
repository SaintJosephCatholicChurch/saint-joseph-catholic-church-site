type NetlifyAuthenticatorConfig = {
  authEndpoint?: string;
  baseUrl?: string;
  siteId?: string;
};

type AuthenticateOptions = {
  provider: 'github';
  scope?: string;
};

type NetlifyAuthResponse = {
  token?: string;
};

const NETLIFY_API = 'https://api.netlify.com';
const AUTH_ENDPOINT = 'auth';

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '');
}

export class NetlifyAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetlifyAuthError';
  }
}

export class NetlifyGitHubAuthenticator {
  private authEndpoint: string;
  private authWindow: Window | null;
  private baseUrl: string;
  private siteId: string | null;

  constructor(config: NetlifyAuthenticatorConfig = {}) {
    this.siteId = config.siteId || null;
    this.baseUrl = config.baseUrl?.replace(/\/+$/g, '') || NETLIFY_API;
    this.authEndpoint = trimSlashes(config.authEndpoint || AUTH_ENDPOINT) || AUTH_ENDPOINT;
    this.authWindow = null;
  }

  async authenticate(options: AuthenticateOptions): Promise<NetlifyAuthResponse> {
    if (typeof window === 'undefined') {
      throw new NetlifyAuthError('GitHub authentication is only available in the browser.');
    }

    const siteId = this.getSiteId();
    if (!siteId) {
      throw new NetlifyAuthError('NEXT_PUBLIC_NETLIFY_SITE_ID must be set at build time for admin login on this site.');
    }

    return new Promise<NetlifyAuthResponse>((resolve, reject) => {
      const expectedOrigin = new URL(this.baseUrl).origin;
      const AUTH_TIMEOUT_MS = 120000;
      let pollTimer: number | null = null;
      let timeoutTimer: number | null = null;
      let settled = false;

      const closeAuthWindow = () => {
        this.authWindow?.close();
      };
      const postToAuthWindow = (message: string, origin: string) => {
        this.authWindow?.postMessage(message, origin);
      };
      const parseAuthPayload = <T>(rawPayload: string) => {
        try {
          return JSON.parse(rawPayload) as T;
        } catch {
          throw new NetlifyAuthError('GitHub authentication returned an unreadable response.');
        }
      };
      function cleanup() {
        window.removeEventListener('message', handleHandshake, false);
        window.removeEventListener('message', handleAuthorization, false);

        if (pollTimer !== null) {
          window.clearInterval(pollTimer);
          pollTimer = null;
        }

        if (timeoutTimer !== null) {
          window.clearTimeout(timeoutTimer);
          timeoutTimer = null;
        }
      }

      const finish = (callback: () => void) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        callback();
      };

      function handleAuthorization(event: MessageEvent<string>) {
        if (event.origin !== expectedOrigin) {
          return;
        }

        const successPrefix = `authorization:${options.provider}:success:`;
        const errorPrefix = `authorization:${options.provider}:error:`;

        if (typeof event.data === 'string' && event.data.startsWith(successPrefix)) {
          try {
            const payload = parseAuthPayload<NetlifyAuthResponse>(event.data.slice(successPrefix.length));
            finish(() => {
              closeAuthWindow();
              resolve(payload);
            });
          } catch (error) {
            finish(() => {
              closeAuthWindow();
              reject(error instanceof NetlifyAuthError ? error : new NetlifyAuthError('GitHub authentication failed.'));
            });
          }
          return;
        }

        if (typeof event.data === 'string' && event.data.startsWith(errorPrefix)) {
          try {
            const payload = parseAuthPayload<{ message?: string }>(event.data.slice(errorPrefix.length));
            finish(() => {
              closeAuthWindow();
              reject(new NetlifyAuthError(payload.message || 'GitHub authentication failed.'));
            });
          } catch (error) {
            finish(() => {
              closeAuthWindow();
              reject(error instanceof NetlifyAuthError ? error : new NetlifyAuthError('GitHub authentication failed.'));
            });
          }
        }
      }

      function handleHandshake(event: MessageEvent<string>) {
        if (event.origin !== expectedOrigin) {
          return;
        }

        if (event.data === `authorizing:${options.provider}`) {
          window.removeEventListener('message', handleHandshake, false);
          window.addEventListener('message', handleAuthorization, false);
          postToAuthWindow(event.data, event.origin);
        }
      }

      window.addEventListener('message', handleHandshake, false);

      const url = new URL(`${this.baseUrl}/${this.authEndpoint}`);
      url.searchParams.set('provider', options.provider);
      url.searchParams.set('site_id', siteId);

      if (options.scope) {
        url.searchParams.set('scope', options.scope);
      }

      this.authWindow = window.open(url.toString(), 'Netlify Authorization');
      if (!this.authWindow) {
        finish(() => {
          reject(new NetlifyAuthError('The authentication popup was blocked.'));
        });
        return;
      }

      this.authWindow.focus();
      pollTimer = window.setInterval(() => {
        if (this.authWindow && !this.authWindow.closed) {
          return;
        }

        finish(() => {
          reject(new NetlifyAuthError('GitHub authentication was cancelled.'));
        });
      }, 500);
      timeoutTimer = window.setTimeout(() => {
        finish(() => {
          closeAuthWindow();
          reject(new NetlifyAuthError('GitHub authentication timed out. Please try again.'));
        });
      }, AUTH_TIMEOUT_MS);
    });
  }

  private getSiteId() {
    if (this.siteId) {
      return this.siteId;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const host = window.location.host.split(':')[0];
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'cms.netlify.com';
    }

    return null;
  }
}
