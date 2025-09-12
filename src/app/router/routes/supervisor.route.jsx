import { PERMISSIONS } from 'constants/app.constant';
import { Navigate } from 'react-router';
import PrivateRoute from '../private';

const supervisorRoute = [
  {
    path: 'users/supervisor',
    lazy: async () => {
      const { default: SupervisorList } = await import('../../pages/users/supervisor/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SUPERVISOR.LIST}>
            <SupervisorList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'users/supervisor/:supervisorUID/tab',
    lazy: async () => ({
      Component: (await import('../../pages/users/supervisor/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute permission={PERMISSIONS.SUPERVISOR.LIST}>
            <Navigate to="./details" />
          </PrivateRoute>
        )
      },
      {
        path: 'details',
        lazy: async () => {
          const { default: ViewDetails } = await import(
            '../../pages/users/supervisor/ViewSupervisor'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.SUPERVISOR.LIST}>
                <ViewDetails />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'calling-agents',
        lazy: async () => {
          const { default: CallingAgents } = await import(
            '../../pages/users/supervisor/calling-agents/list/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.SUPERVISOR.LIST}>
                <CallingAgents />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'calling-agents-details/:callingAgentUID',
        lazy: async () => {
          const { default: CallingAgentsDetails } = await import(
            '../../pages/users/supervisor/calling-agents/ViewAgents'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.SUPERVISOR.LIST}>
                <CallingAgentsDetails />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'login-history',
        lazy: async () => {
          const { default: LoginHistory } = await import(
            '../../pages/users/supervisor/login-history/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.SUPERVISOR.LIST}>
                <LoginHistory />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

const callingAgentsRoute = [
  {
    path: 'calling-agents/supervisor-dashboard',
    lazy: async () => {
      const { default: SuervisorDashboard } = await import(
        '../../pages/users/supervisor/dashboard/SuervisorDashboard'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
            <SuervisorDashboard />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'calling-agents/list',
    lazy: async () => {
      const { default: CallingAgentsList } = await import(
        '../../pages/users/calling-agents/list/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
            <CallingAgentsList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'calling-agents/list/create',
    lazy: async () => {
      const { default: Create } = await import(
        '../../pages/users/calling-agents/CreateCallingAgent'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.Add}>
            <Create />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'calling-agents/list/:agentUID/edit',
    lazy: async () => {
      const { default: Edit } = await import('../../pages/users/calling-agents/EditCallingAgent');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.EDIT}>
            <Edit />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'calling-agents/list/:agentUID/tab',
    lazy: async () => ({
      Component: (await import('../../pages/users/calling-agents/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
            <Navigate to="./details" />
          </PrivateRoute>
        )
      },
      {
        path: 'details',
        lazy: async () => {
          const { default: ViewDetails } = await import(
            '../../pages/users/calling-agents/ViewCallingAgent'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
                <ViewDetails />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'login-history',
        lazy: async () => {
          const { default: LoginHistory } = await import(
            '../../pages/users/calling-agents/login-history/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
                <LoginHistory />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'target-management',
        lazy: async () => {
          const { default: TargetManagement } = await import(
            '../../pages/users/calling-agents/target-management/TargetManagement'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
                <TargetManagement />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'redeem-requests',
        lazy: async () => {
          const { default: RedeemRequests } = await import(
            '../../pages/users/calling-agents/redeem-requests/RedeemRequests'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
                <RedeemRequests />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'assigned-players',
        lazy: async () => {
          const { default: AssignedPlayers } = await import(
            '../../pages/users/calling-agents/assigned-players/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
                <AssignedPlayers />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'commission-summary',
        lazy: async () => {
          const { default: CommissionSummary } = await import(
            '../../pages/users/calling-agents/comssionSummary'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
                <CommissionSummary />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  },
  {
    path: 'calling-agents/list/:agentUID/commission-summary/:summaryId/details',
    lazy: async () => {
      const { default: CommissionSummaryDetails } = await import(
        '../../pages/users/calling-agents/commission-summary-details/CommissionSummaryDetails'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
            <CommissionSummaryDetails />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'calling-agents/list/:agentUID/unassigned-players',
    lazy: async () => {
      const { default: UnassignedPlayers } = await import(
        '../../pages/users/calling-agents/assigned-players/UnassignedPlayers'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.CALLING_AGENT.LIST}>
            <UnassignedPlayers />
          </PrivateRoute>
        )
      };
    }
  }
];

export { supervisorRoute, callingAgentsRoute };
