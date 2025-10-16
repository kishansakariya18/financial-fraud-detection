// import { Navigate } from "react-router";

import { PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
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
  },
  {
    path: 'report/agent-commission',
    lazy: async () => {
      const { default: AgentCommission } = await import(
        '../../pages/b2b-agent/admin/report/AgentCommission'
      );
      return {
        Component: () => (
          <PrivateRoute
            permission={PERMISSIONS.REPORT.AGENT_COMMISSION_REPORT}
            allowedPlatforms={[PLATFORM_TYPE.B2B]}>
            <AgentCommission />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'report/agent-wallet',
    lazy: async () => {
      const { default: AgentWallet } = await import(
        '../../pages/b2b-agent/admin/report/AgentWallet'
      );
      return {
        Component: () => (
          <PrivateRoute
            permission={PERMISSIONS.REPORT.AGENT_WALLET_REPORT}
            allowedPlatforms={[PLATFORM_TYPE.B2B]}>
            <AgentWallet />
          </PrivateRoute>
        )
      };
    }
  }
];

export default reportsRoutes;
