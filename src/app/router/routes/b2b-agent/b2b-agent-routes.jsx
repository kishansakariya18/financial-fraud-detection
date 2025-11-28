import { Navigate } from 'react-router';

const b2bAgentRoutes = [
  {
    path: 'agent/dashboard',
    lazy: async () => {
      const { default: AgentDashboard } = await import('../../../pages/b2b-agent/agent/Dashboard');
      return {
        Component: AgentDashboard
      };
    }
  },
  {
    path: 'agent/tree-view',
    lazy: async () => {
      const { default: AgentAgentTree } =
        await import('../../../pages/b2b-agent/agent/AgentAgentTree');
      return {
        Component: AgentAgentTree
      };
    }
  },
  {
    path: 'agent/transaction',
    lazy: async () => {
      const { default: AgentTransaction } =
        await import('../../../pages/b2b-agent/agent/AgentTransaction');
      return {
        Component: AgentTransaction
      };
    }
  },
  {
    path: 'agent/my-requests',
    lazy: async () => {
      const { default: MyWithdrawRequest } =
        await import('../../../pages/b2b-agent/agent/MyWithdrawRequest');
      return {
        Component: MyWithdrawRequest
      };
    }
  },
  {
    path: 'agent/agent-withdrawals',
    lazy: async () => {
      const { default: AgentWithdrawRequest } =
        await import('../../../pages/b2b-agent/agent/AgentWithdrawReques');
      return {
        Component: AgentWithdrawRequest
      };
    }
  },
  {
    path: 'agent/player-requests',
    lazy: async () => {
      const { default: PlayerWithdrawRequest } =
        await import('../../../pages/b2b-agent/agent/PlayerWithdrawRequest');
      return {
        Component: PlayerWithdrawRequest
      };
    }
  },
  {
    path: 'agents',
    children: [
      {
        index: true,
        lazy: async () => {
          const { ChildAgentList } = await import('../../../pages/b2b-agent/agent');
          return {
            Component: () => <ChildAgentList />
          };
        }
      },
      {
        path: 'add',
        lazy: async () => {
          const { AddChildAgent } = await import('../../../pages/b2b-agent/agent');
          return {
            Component: () => <AddChildAgent />
          };
        }
      },
      {
        path: ':agentUID/edit',
        lazy: async () => {
          const { EditChildAgent } = await import('../../../pages/b2b-agent/agent');
          return {
            Component: () => <EditChildAgent />
          };
        }
      },
      {
        path: ':agentUID/tab',
        lazy: async () => ({
          Component: (await import('../../../pages/b2b-agent/agent/AgentTabs')).default
        }),
        children: [
          {
            index: true,
            element: <Navigate to="./details" />
          },
          {
            path: 'details',
            lazy: async () => {
              const { default: ChildAgentDetails } =
                await import('../../../pages/b2b-agent/agent/tabs/ChildAgentDetails');
              return {
                Component: () => <ChildAgentDetails />
              };
            }
          },
          {
            path: 'login-history',
            lazy: async () => {
              const { default: ChildAgentLoginHistory } =
                await import('../../../pages/b2b-agent/agent/tabs/ChildAgentLoginHistory');
              return {
                Component: () => <ChildAgentLoginHistory />
              };
            }
          },
          {
            path: 'wallet',
            lazy: async () => {
              const { default: ChildAgentWallet } =
                await import('../../../pages/b2b-agent/agent/tabs/ChildAgentWallet');
              return {
                Component: () => <ChildAgentWallet />
              };
            }
          },
          {
            path: 'agents',
            lazy: async () => {
              const { default: ChildAgentList } =
                await import('../../../pages/b2b-agent/agent/tabs/ChildAgentList');
              return {
                Component: () => <ChildAgentList />
              };
            }
          },
          {
            path: 'players',
            lazy: async () => {
              const { default: ChildAgentPlayerList } =
                await import('../../../pages/b2b-agent/agent/tabs/ChildAgentPlayerList');
              return {
                Component: () => <ChildAgentPlayerList />
              };
            }
          },
          {
            path: 'withdraw-requests',
            lazy: async () => {
              const { default: ChildAgentWithdrawRequest } =
                await import('../../../pages/b2b-agent/agent/tabs/ChildAgentWithdrawRequest');
              return {
                Component: () => <ChildAgentWithdrawRequest />
              };
            }
          }
        ]
      }
    ]
  },
  {
    path: 'players',
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: AgentPlayerList } =
            await import('../../../pages/b2b-agent/agent/player/AgentPlayerList');
          return {
            Component: AgentPlayerList
          };
        }
      },
      {
        path: 'create',
        lazy: async () => {
          const { default: CreatePlayer } =
            await import('../../../pages/b2b-agent/agent/player/CreatePlayer');
          return {
            Component: CreatePlayer
          };
        }
      },
      {
        path: ':playerUID/edit',
        lazy: async () => {
          const { EditPlayer } = await import('../../../pages/b2b-agent/agent/player/EditPlayer');
          return {
            Component: EditPlayer
          };
        }
      },
      {
        path: ':playerUID/tab',
        lazy: async () => {
          const { default: PlayerDetailTabs } =
            await import('../../../pages/b2b-agent/agent/player/PlayerDetailTabs');
          return {
            Component: PlayerDetailTabs
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
              const { default: PlayerDetails } =
                await import('../../../pages/b2b-agent/agent/player/tabs/PlayerDetails');
              return {
                Component: PlayerDetails
              };
            }
          },
          {
            path: 'transactions',
            lazy: async () => {
              const { default: PlayerTransactions } =
                await import('../../../pages/b2b-agent/agent/player/tabs/PlayerTransactions');
              return {
                Component: PlayerTransactions
              };
            }
          },
          {
            path: 'login-history',
            lazy: async () => {
              const { default: PlayerLoginHistory } =
                await import('../../../pages/b2b-agent/agent/player/tabs/PlayerLoginHistory');
              return {
                Component: PlayerLoginHistory
              };
            }
          },
          {
            path: 'wallets',
            lazy: async () => {
              const { default: PlayerWallets } =
                await import('../../../pages/b2b-agent/agent/player/tabs/PlayerWallets');
              return {
                Component: PlayerWallets
              };
            }
          }
        ]
      }
    ]
  }
];

export default b2bAgentRoutes;
