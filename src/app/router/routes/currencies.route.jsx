import { lazy } from 'react';

const CurrencyList = lazy(() => import('../../pages/casino-management/currencies/list/list'));
const EditCurrency = lazy(() => import('../../pages/casino-management/currencies/EditCurrency'));

const currenciesRoutes = [
  {
    path: '/casino-management/currencies',
    element: <CurrencyList />
  },
  {
    path: '/casino-management/currencies/add',
    element: <EditCurrency />
  },
  {
    path: '/casino-management/currencies/edit/:id',
    element: <EditCurrency />
  }
];

export default currenciesRoutes;
