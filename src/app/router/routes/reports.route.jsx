// import { Navigate } from "react-router";

import { PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
import PrivateRoute from '../private';

export const reportsRoutes = [
  {
    path: 'report/betslip-transctions',
    lazy: async () => {
      const { default: BetslipList } = await import('../../pages/reports/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.REPORTS.BETSLIP.VIEW}>
            <BetslipList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'report/deposit-transctions',
    lazy: async () => {
      const { default: DepositTxnList } = await import('../../pages/reports/deposit-txn-list/list');
      return {
        Component: () => (
          <PrivateRoute
            permission={PERMISSIONS.REPORTS.DEPOSIT.VIEW}
            allowedPlatforms={[PLATFORM_TYPE.B2C]}>
            <DepositTxnList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'report/withdraw-transctions',
    lazy: async () => {
      const { default: WithdrawTxnList } =
        await import('../../pages/reports/withdraw-txn-list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.REPORTS.WITHDRAW.VIEW}>
            <WithdrawTxnList />
          </PrivateRoute>
        )
      };
    }
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
      const { default: AgentCommission } =
        await import('../../pages/b2b-agent/admin/report/AgentCommission');
      return {
        Component: () => (
          <PrivateRoute
            permission={PERMISSIONS.REPORTS.B2B_AGENT.AGENT_COMMISSION_REPORT}
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
      const { default: AgentWallet } =
        await import('../../pages/b2b-agent/admin/report/AgentWallet');
      return {
        Component: () => (
          <PrivateRoute
            permission={PERMISSIONS.REPORTS.B2B_AGENT.AGENT_WALLET_REPORT}
            allowedPlatforms={[PLATFORM_TYPE.B2B]}>
            <AgentWallet />
          </PrivateRoute>
        )
      };
    }
  }
];

export default reportsRoutes;
