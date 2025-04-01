import { Navigate } from 'react-router';

export const roleRoutes = [
  {
    path: 'roles',
    children: [
      {
        index: true,
        element: <Navigate to="/add" />
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
    ]
  }
];

export default roleRoutes;
