import { PERMISSIONS } from 'constants/app.constant';
// import { Navigate } from 'react-router';
import PrivateRoute from '../private';

export const b2bAgentRoutes = [
  {
    path: 'b2b-agents',
    children: [
      {
        index: true,
        lazy: async () => {
          const { B2BAgentList } = await import('../../pages/b2b-agent');
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
        path: 'add',
        lazy: async () => {
          const { AddAgent } = await import('../../pages/b2b-agent');
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
          const { EditAgent } = await import('../../pages/b2b-agent');
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
        path: ':agentUID/view',
        lazy: async () => {
          const { ViewAgent } = await import('../../pages/b2b-agent');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AGENTS.VIEW}>
                <ViewAgent />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default b2bAgentRoutes;
