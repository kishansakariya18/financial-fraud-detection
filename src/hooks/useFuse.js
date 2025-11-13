import Fuse from 'fuse.js';
import { useMemo, useState, useDeferredValue } from 'react';

export function useFuse(list, options = {}) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const { limit, matchAllOnEmptyQuery = true, keys, ...fuseOptions } = options;

  const shouldFilter = Array.isArray(keys) && keys.length > 0;

  const fuse = useMemo(() => {
    if (!shouldFilter) {
      return null;
    }
    return new Fuse(list, { ...fuseOptions, keys });
  }, [list, fuseOptions, keys, shouldFilter]);

  const result = useMemo(() => {
    if (!shouldFilter || !fuse) {
      const sliceLimit = typeof limit === 'number' && limit >= 0 ? limit : undefined;
      const source = sliceLimit ? list.slice(0, sliceLimit) : list;
      return source.map((item, refIndex) => ({ item, refIndex }));
    }

    return !deferredQuery && matchAllOnEmptyQuery
      ? fuse
          .getIndex()
          .docs.slice(0, limit)
          .map((item, refIndex) => ({ item, refIndex }))
      : fuse.search(deferredQuery.toString().trim(), { limit });
  }, [shouldFilter, fuse, list, deferredQuery, limit, matchAllOnEmptyQuery]);

  const loading = shouldFilter ? deferredQuery !== query : false;

  return {
    result,
    query: deferredQuery,
    loading,
    setQuery
  };
}
