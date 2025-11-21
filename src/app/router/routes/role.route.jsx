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
        lazy: async () => {
          const { default: AddRole } = await import('../../pages/roles/AddRole');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.ROLES.ADD}>
                <AddRole />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'edit/:roleId',
        lazy: async () => {
          const { default: EditRole } = await import('../../pages/roles/EditRole');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.ROLES.EDIT}>
                <EditRole />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default roleRoutes;
