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
  }
];
export default userClasseRoute;
