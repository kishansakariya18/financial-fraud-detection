import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
export const userClasseRoute = [
  {
    path: '/user-class',
    lazy: async () => {
      const { default: UserClass } = await import('../../pages/user-class/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.LIST}>
            <UserClass />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/create',
    lazy: async () => {
      const { default: CreateUserClass } = await import('../../pages/user-class/CreateUserClass');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.CREATE}>
            <CreateUserClass />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: '/user-class/:userClassUID/edit',
    lazy: async () => {
      const { default: EditUserClass } = await import('../../pages/user-class/EditUserClass');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_CLASS.EDIT}>
            <EditUserClass />
          </PrivateRoute>
        )
      };
    }
  }
];
export default userClasseRoute;
