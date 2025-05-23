// import { Navigate } from "react-router";

export const reportsRoutes = [
  {
    path: 'report/betslip-transctions',
    lazy: async () => ({
      Component: (await import('../../pages/reports/list/list')).default
    })
  },
  {
    path: 'report/deposit-transctions',
    lazy: async () => ({
      Component: (await import('../../pages/reports/deposit-txn-list/list')).default
    })
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
