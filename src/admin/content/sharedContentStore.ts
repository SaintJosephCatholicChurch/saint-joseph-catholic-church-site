import type { AdminRepoClient } from '../services/adminTypes';

type SharedResourceEntry<T> = {
  promise?: Promise<T>;
  value?: T;
};

const repoStores = new WeakMap<AdminRepoClient, Map<string, SharedResourceEntry<unknown>>>();

function getRepoStore(repoClient: AdminRepoClient) {
  let store = repoStores.get(repoClient);

  if (!store) {
    store = new Map<string, SharedResourceEntry<unknown>>();
    repoStores.set(repoClient, store);
  }

  return store;
}

export function getSharedContentResource<T>(repoClient: AdminRepoClient, key: string) {
  return getRepoStore(repoClient).get(key)?.value as T | undefined;
}

export async function loadSharedContentResource<T>(
  repoClient: AdminRepoClient,
  key: string,
  loader: () => Promise<T>
): Promise<T> {
  const store = getRepoStore(repoClient);
  const existingEntry = store.get(key) as SharedResourceEntry<T> | undefined;

  if (existingEntry?.value !== undefined) {
    return existingEntry.value;
  }

  if (existingEntry?.promise !== undefined) {
    return existingEntry.promise;
  }

  const nextEntry: SharedResourceEntry<T> = {};
  const nextPromise = loader().then((value) => {
    nextEntry.value = value;
    return value;
  });

  nextEntry.promise = nextPromise;
  store.set(key, nextEntry);

  try {
    return await nextPromise;
  } finally {
    const latestEntry = store.get(key) as SharedResourceEntry<T> | undefined;
    if (latestEntry) {
      delete latestEntry.promise;
    }
  }
}

export function setSharedContentResource<T>(repoClient: AdminRepoClient, key: string, value: T) {
  getRepoStore(repoClient).set(key, { value });
  return value;
}

export function clearSharedContentResource(repoClient: AdminRepoClient, key?: string) {
  const store = getRepoStore(repoClient);

  if (key) {
    store.delete(key);
    return;
  }

  store.clear();
}
