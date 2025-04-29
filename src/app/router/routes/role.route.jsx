import { PERMISSIONS } from 'constants/app.constant';
// import { Navigate } from 'react-router';
import PrivateRoute from '../private';

export const roleRoutes = [
  {
    path: 'roles',
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: RoleList } = await import('../../pages/roles/list/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.ROLES.VIEW}>
                <RoleList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'add',
        lazy: async () => ({
          Component: (await import('../../pages/roles/AddRole')).default
        })
      },
      {
        path: 'edit/:rolePermissionId',
        lazy: async () => ({
          Component: (await import('../../pages/roles/EditRole')).default
        })
      }
      // {
      //   path: 'delete/:rolePermissionId',
      //   lazy: async () => ({
      //     Component: (await import('../../pages/roles/DeleteRole')).default
      //   })
      // }
    ]
  }
];

export default roleRoutes;
