// import { Navigate } from "react-router";

import { PLATFORM_TYPE } from 'constants/app.constant';
import PrivateRoute from '../private';

export const reportsRoutes = [
  {
    path: 'report/betslip-transctions',
    lazy: async () => ({
      Component: (await import('../../pages/reports/list/list')).default
    })
  },
  {
    path: 'report/deposit-transctions',
    lazy: async () => {
      const { default: DepositTxnList } = await import('../../pages/reports/deposit-txn-list/list');
      return {
        Component: () => (
          <PrivateRoute allowedPlatforms={[PLATFORM_TYPE.B2C]}>
            <DepositTxnList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'report/withdraw-transctions',
    lazy: async () => ({
      Component: (await import('../../pages/reports/withdraw-txn-list/list')).default
    })
  },
  {
    path: 'report/player-balance/list',
    lazy: async () => ({
      Component: (await import('../../pages/reports/player-balance/list')).default
    })
  },
  {
    path: 'report/deposit-bonus',
    lazy: async () => ({
      Component: (await import('../../pages/reports/player-balance/list')).default
    })
  }
];

export default reportsRoutes;
