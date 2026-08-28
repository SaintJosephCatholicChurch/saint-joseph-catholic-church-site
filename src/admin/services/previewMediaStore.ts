const DB_NAME = 'site-admin-preview-media';
const STORE_NAME = 'blobs';
const DB_VERSION = 1;

function openPreviewMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open preview media storage.'));
  });
}

function withPreviewMediaStore(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest): Promise<unknown> {
  return openPreviewMediaDb().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = run(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Preview media storage request failed.'));
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => {
          database.close();
          reject(transaction.error || new Error('Preview media storage transaction failed.'));
        };
      })
  );
}

export function notifyPreviewMediaUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event('admin-preview-media-updated'));
}

export async function putPreviewMediaBlob(path: string, blob: Blob) {
  if (typeof window === 'undefined') {
    return;
  }

  await withPreviewMediaStore('readwrite', (store) => store.put(blob, path));
  notifyPreviewMediaUpdated();
}

export async function getPreviewMediaBlob(path: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  const blob = await withPreviewMediaStore('readonly', (store) => store.get(path));
  return blob instanceof Blob ? blob : null;
}

export async function deletePreviewMediaBlob(path: string) {
  if (typeof window === 'undefined') {
    return;
  }

  await withPreviewMediaStore('readwrite', (store) => store.delete(path));
  notifyPreviewMediaUpdated();
}

export async function listPreviewMediaPaths() {
  if (typeof window === 'undefined') {
    return [] as string[];
  }

  const keys = await withPreviewMediaStore('readonly', (store) => store.getAllKeys());

  if (!Array.isArray(keys)) {
    return [];
  }

  return keys.map((key) => String(key));
}

export async function clearPreviewMediaBlobs() {
  if (typeof window === 'undefined') {
    return;
  }

  await withPreviewMediaStore('readwrite', (store) => store.clear());
  notifyPreviewMediaUpdated();
}

export function repoPathToPublicPath(path: string) {
  const normalizedPath = path.replace(/\\/g, '/').replace(/^\/+/, '');

  if (normalizedPath.startsWith('public/')) {
    return `/${normalizedPath.slice('public/'.length)}`;
  }

  return `/${normalizedPath}`;
}
