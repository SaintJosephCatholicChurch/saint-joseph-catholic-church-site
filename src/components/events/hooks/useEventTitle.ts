import { useMemo } from 'react';

import { isNullish } from '../../../util/null.util';

export default function useEventTitle(title?: string | undefined | null): string {
  return useMemo(() => {
    if (isNullish(title) || title === 'undefined') {
      return 'No Title';
    }

    return title;
  }, [title]);
}
