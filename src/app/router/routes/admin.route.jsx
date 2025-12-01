import { PERMISSIONS } from 'constants/app.constant';
import { Navigate } from 'react-router';
import PrivateRoute from '../private';

export const adminRoute = [
  {
    path: 'users/admin',
    lazy: async () => {
      const { default: AdminList } = await import('../../pages/users/admin/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.ADMIN.LIST}>
            <AdminList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'users/admin/:adminId/tab',
    lazy: async () => ({
      Component: (await import('../../pages/users/admin/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { default: ViewDetails } = await import('../../pages/users/admin/ViewDetails');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.ADMIN.LIST}>
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
            '../../pages/users/admin/login-history/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.ADMIN.LIST}>
                <LoginHistory />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  },
  {
    path: 'users/admin/create',
    lazy: async () => {
      const { default: Create } = await import('../../pages/users/admin/CreateAdmin');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.ADMIN.CREATE}>
            <Create />
          </PrivateRoute>
        )
      };
    }
  },

  {
    path: 'users/admin/:adminId/edit',
    lazy: async () => {
      const { default: Edit } = await import('../../pages/users/admin/EditAdmin');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.ADMIN.EDIT}>
            <Edit />
          </PrivateRoute>
        )
      };
    }
  }
];

export default adminRoute;
