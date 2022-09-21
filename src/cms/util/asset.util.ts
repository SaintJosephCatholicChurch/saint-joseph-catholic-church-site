import { Map } from 'immutable';
import { isNotNullish } from '../../util/null.util';

export function getFieldAsset(field: Map<string, any>, getAsset: (path: string, field: Map<string, any>) => string) {
  return (url: string) => {
    const asset = getAsset(url, field);
    if (isNotNullish(asset)) {
      return asset;
    }

    return getAsset(url.replace(/^\//g, ''), field);
  };
}
