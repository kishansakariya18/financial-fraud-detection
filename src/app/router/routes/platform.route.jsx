import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const platformRoute = [
  {
    path: 'platform-limit',
    lazy: async () => {
      const { default: PlatformLimit } = await import('../../pages/platform-limit/PlatformLimit');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_LIMIT_SETTING.UPDATE}>
            <PlatformLimit />
          </PrivateRoute>
        )
      };
    }
  }
];

export default platformRoute;
