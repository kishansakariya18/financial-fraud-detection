import { PERMISSIONS } from 'constants/app.constant';
import { Navigate } from 'react-router';
import PrivateRoute from '../../private';

const b2bAgentAdminRoutes = [
  {
    path: 'agent',
    children: [
      {
        path: 'list',
        lazy: async () => {
          const { B2BAgentList } = await import('../../../pages/b2b-agent/admin');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                <B2BAgentList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'withdraw-requests',
        lazy: async () => {
          const { default: AdminWithdrawRequest } = await import(
            '../../../pages/b2b-agent/admin/AdminWithdrawRequest'
          );
          return {
            Component: AdminWithdrawRequest
          };
        }
      },
      {
        path: 'add',
        lazy: async () => {
          const { AddAgent } = await import('../../../pages/b2b-agent/admin');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AGENTS.ADD}>
                <AddAgent />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: ':agentUID/edit',
        lazy: async () => {
          const { EditAgent } = await import('../../../pages/b2b-agent/admin');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AGENTS.EDIT}>
                <EditAgent />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: ':agentUID/tab',
        lazy: async () => ({
          Component: (await import('../../../pages/b2b-agent/admin/AgentTabs')).default
        }),
        children: [
          {
            index: true,
            element: <Navigate to="./details" />
          },
          {
            path: 'details',
            lazy: async () => {
              const { default: AgentDetails } = await import(
                '../../../pages/b2b-agent/admin/tabs/AgentDetails'
              );
              return {
                Component: () => (
                  <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                    <AgentDetails />
                  </PrivateRoute>
                )
              };
            }
          },
          {
            path: 'login-history',
            lazy: async () => {
              const { default: AgentLoginHistory } = await import(
                '../../../pages/b2b-agent/admin/tabs/AgentLoginHistory'
              );
              return {
                Component: () => (
                  <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                    <AgentLoginHistory />
                  </PrivateRoute>
                )
              };
            }
          },
          {
            path: 'wallet',
            lazy: async () => {
              const { default: AgentWallet } = await import(
                '../../../pages/b2b-agent/admin/tabs/AgentWallet'
              );
              return {
                Component: () => (
                  <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                    <AgentWallet />
                  </PrivateRoute>
                )
              };
            }
          },
          {
            path: 'agents',
            lazy: async () => {
              const { default: AgentAgents } = await import(
                '../../../pages/b2b-agent/admin/tabs/AgentAgents'
              );
              return {
                Component: () => (
                  <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                    <AgentAgents />
                  </PrivateRoute>
                )
              };
            }
          },
          {
            path: 'players',
            lazy: async () => {
              const { default: AgentPlayerList } = await import(
                '../../../pages/b2b-agent/admin/tabs/AgentPlayerList'
              );
              return {
                Component: () => (
                  <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                    <AgentPlayerList />
                  </PrivateRoute>
                )
              };
            }
          },
          {
            path: 'withdraw-requests',
            lazy: async () => {
              const { default: AgentWithdrawRequest } = await import(
                '../../../pages/b2b-agent/admin/tabs/AgentWithdrawRequest'
              );
              return {
                Component: () => (
                  <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                    <AgentWithdrawRequest />
                  </PrivateRoute>
                )
              };
            }
          }
        ]
      }
    ]
  }
];

export default b2bAgentAdminRoutes;
