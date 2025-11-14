import { lazy } from 'react';
import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

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
    element: (
      <PrivateRoute permission={PERMISSIONS.CURRENCY.VIEW}>
        <CurrencyList />
      </PrivateRoute>
    )
  },
  {
    path: 'casino-management/currencies/create',
    element: (
      <PrivateRoute permission={PERMISSIONS.CURRENCY.CREATE}>
        <CreateCurrency />
      </PrivateRoute>
    )
  },
  {
    path: 'casino-management/currencies/edit/:currencyId',
    element: (
      <PrivateRoute permission={PERMISSIONS.CURRENCY.EDIT}>
        <EditCurrency />
      </PrivateRoute>
    )
  },
  {
    path: 'casino-management/currencies/exchange-history/:currencyCode/list',
    element: (
      <PrivateRoute permission={PERMISSIONS.CURRENCY.EXCHANGE_RATE_HISTORY}>
        <ExchangeHistoryList />
      </PrivateRoute>
    )
  }
];

export default currenciesRoutes;
