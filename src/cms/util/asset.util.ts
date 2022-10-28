import { isNotNullish } from '../../util/null.util';

import type { Map } from 'immutable';

export function getFieldAsset(field: Map<string, unknown>, getAsset: (path: string, field: Map<string, unknown>) => string) {
  return (url: string) => {
    const asset = getAsset(url, field);
    if (isNotNullish(asset)) {
      return asset;
    }

    return getAsset(url.replace(/^\//g, ''), field);
  };
}
