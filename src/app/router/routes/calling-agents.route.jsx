import { Navigate } from 'react-router';

const onlyCallingAgentRoutes = [
  {
    path: 'calling-agents/dashboard',
    lazy: async () => {
      const { default: AgentDashboard } =
        await import('../../pages/calling-agent-manage/dashbaord/AgentDashboard');
      return {
        Component: AgentDashboard
      };
    }
  },
  {
    path: 'calling-agents/targets',
    lazy: async () => {
      const { default: AgentTargets } =
        await import('../../pages/calling-agent-manage/targets/Targets');
      return {
        Component: AgentTargets
      };
    }
  },
  {
    path: 'calling-agents/assigned-players',
    lazy: async () => {
      const { default: AgentAssignedPlayers } =
        await import('../../pages/calling-agent-manage/assigned-players/AssignedPlayers');
      return {
        Component: AgentAssignedPlayers
      };
    }
  },
  {
    path: 'calling-agents/assigned-players-details/:playerId/tab',
    lazy: async () => {
      const { default: AgentPlayerDetailTabs } =
        await import('../../pages/calling-agent-manage/assigned-players-details/Tabs');
      return {
        Component: AgentPlayerDetailTabs
      };
    },
    children: [
      {
        index: true,
        element: <Navigate to="./details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { default: AgentPlayerDetails } =
            await import('../../pages/calling-agent-manage/assigned-players-details/PlayerDetails');
          return {
            Component: AgentPlayerDetails
          };
        }
      },
      // {
      //   path: 'limit',
      //   lazy: async () => {
      //     const { default: AgentPlayerLimit } = await import(
      //       '../../pages/calling-agent-manage/assigned-players-details/PlayerLimit'
      //     );
      //     return {
      //       Component: AgentPlayerLimit
      //     };
      //   }
      // },
      {
        path: 'transactions',
        lazy: async () => {
          const { default: AgentPlayerTransactions } =
            await import('../../pages/calling-agent-manage/assigned-players-details/PlayerTransactions');
          return {
            Component: AgentPlayerTransactions
          };
        }
      },
      {
        path: 'total-events',
        lazy: async () => {
          const { default: AgentPlayerTotalEvents } =
            await import('../../pages/calling-agent-manage/assigned-players-details/TotalEvents');
          return {
            Component: AgentPlayerTotalEvents
          };
        }
      },
      {
        path: 'login-history',
        lazy: async () => {
          const { default: AgentPlayerLoginHistory } =
            await import('../../pages/calling-agent-manage/assigned-players-details/PlayerLoginHistory');
          return {
            Component: AgentPlayerLoginHistory
          };
        }
      },
      {
        path: 'player-notes',
        lazy: async () => {
          const { default: AgentPlayerNotes } =
            await import('../../pages/calling-agent-manage/assigned-players-details/PlayerNotes');
          return {
            Component: AgentPlayerNotes
          };
        }
      },
      {
        path: 'referrals',
        lazy: async () => {
          const { default: AgentPlayerReferrals } =
            await import('../../pages/calling-agent-manage/assigned-players-details/PlayerReferrals');
          return {
            Component: AgentPlayerReferrals
          };
        }
      },
      {
        path: 'wallets',
        lazy: async () => {
          const { default: AgentPlayerWallets } =
            await import('../../pages/calling-agent-manage/assigned-players-details/PlayerWallets');
          return {
            Component: AgentPlayerWallets
          };
        }
      }
    ]
  },
  // {
  //   path: 'agent/redeem-commission',
  //   lazy: async () => {
  //     const { default: AgentRedeemCommission } = await import(
  //       '../../pages/agent/redeem-commission/RedeemCommission'
  //     );
  //     return {
  //       Component: () => (
  //         <AgentGuard>
  //           <AgentRedeemCommission />
  //         </AgentGuard>
  //       )
  //     };
  //   }
  // },
  {
    path: 'calling-agents/summary',
    lazy: async () => {
      const { default: AgentSummary } =
        await import('../../pages/calling-agent-manage/summary/Summary');
      return {
        Component: AgentSummary
      };
    }
  },
  {
    path: 'calling-agents/summary/:summaryId/details',
    lazy: async () => {
      const { default: AgentCommissionSummaryDetails } =
        await import('../../pages/calling-agent-manage/commission-summary-details/CommissionSummaryDetails');
      return {
        Component: AgentCommissionSummaryDetails
      };
    }
  }
];

export default onlyCallingAgentRoutes;
