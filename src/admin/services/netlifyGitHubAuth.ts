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
      throw new NetlifyAuthError('A Netlify site id is required to start the GitHub authentication flow.');
    }

    return new Promise<NetlifyAuthResponse>((resolve, reject) => {
      const expectedOrigin = new URL(this.baseUrl).origin;
      const closeAuthWindow = () => {
        this.authWindow?.close();
      };
      const postToAuthWindow = (message: string, origin: string) => {
        this.authWindow?.postMessage(message, origin);
      };

      const cleanup = () => {
        window.removeEventListener('message', handleHandshake, false);
        window.removeEventListener('message', handleAuthorization, false);
      };

      function handleAuthorization(event: MessageEvent<string>) {
        if (event.origin !== expectedOrigin) {
          return;
        }

        const successPrefix = `authorization:${options.provider}:success:`;
        const errorPrefix = `authorization:${options.provider}:error:`;

        if (typeof event.data === 'string' && event.data.startsWith(successPrefix)) {
          cleanup();
          closeAuthWindow();
          const payload = JSON.parse(event.data.slice(successPrefix.length)) as NetlifyAuthResponse;
          resolve(payload);
          return;
        }

        if (typeof event.data === 'string' && event.data.startsWith(errorPrefix)) {
          cleanup();
          closeAuthWindow();
          const payload = JSON.parse(event.data.slice(errorPrefix.length)) as { message?: string };
          reject(new NetlifyAuthError(payload.message || 'GitHub authentication failed.'));
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
        cleanup();
        reject(new NetlifyAuthError('The authentication popup was blocked.'));
        return;
      }

      this.authWindow.focus();
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
    return host === 'localhost' ? 'cms.netlify.com' : host;
  }
}
