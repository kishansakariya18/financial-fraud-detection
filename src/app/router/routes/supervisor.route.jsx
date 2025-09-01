import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const supervisorRoute = [
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
    path: 'users/supervisor/create',
    lazy: async () => {
      const { default: Create } = await import('../../pages/users/supervisor/CreateSupervisor');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SUPERVISOR.CREATE}>
            <Create />
          </PrivateRoute>
        )
      };
    }
  },

  {
    path: 'users/supervisor/:supervisorId/edit',
    lazy: async () => {
      const { default: Edit } = await import('../../pages/users/supervisor/EditSupervisor');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.SUPERVISOR.EDIT}>
            <Edit />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'users/supervisor/:supervisorId/tab',
    lazy: async () => ({
      Component: (await import('../../pages/users/supervisor/ViewSupervisor')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { default: ViewDetails } = await import(
            '../../pages/users/supervisor/ViewSupervisor'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.ADMIN.LIST}>
                <ViewDetails />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default supervisorRoute;
