import { lazy } from 'react';

const IPLookup = lazy(() => import('./IPLookup'));

const ipLookupRoute = {
  path: 'tools/ip-lookup',
  element: <IPLookup />
};

export default ipLookupRoute;
