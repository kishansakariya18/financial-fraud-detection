import { PERMISSIONS } from 'constants/app.constant';
import { Navigate } from 'react-router';
import PrivateRoute from '../private';

export const adminRoute = [
  {
    path: 'admin',
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
    path: 'admin/:adminId/tab',
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
      }
    ]
  },
  {
    path: 'admin/create',
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
    path: 'admin/:adminId/edit',
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
