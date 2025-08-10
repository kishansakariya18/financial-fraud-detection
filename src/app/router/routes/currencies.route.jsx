import { lazy } from 'react';

const CurrencyList = lazy(() => import('../../pages/casino-management/currencies/list/list'));
const CreateCurrency = lazy(
  () => import('../../pages/casino-management/currencies/CreateCurrency')
);
const EditCurrency = lazy(() => import('../../pages/casino-management/currencies/EditCurrency'));
const ExchangeHistoryList = lazy(
  () => import('../../pages/casino-management/currencies/exchange-history/list/list')
);

const currenciesRoutes = [
  {
    path: 'casino-management/currencies',
    element: <CurrencyList />
  },
  {
    path: 'casino-management/currencies/create',
    element: <CreateCurrency />
  },
  {
    path: 'casino-management/currencies/edit/:id',
    element: <EditCurrency />
  },
  {
    path: 'casino-management/currencies/exchange-history/:currencyCode/list',
    element: <ExchangeHistoryList />
  }
];

export default currenciesRoutes;
