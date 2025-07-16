import { Navigate } from 'react-router';
import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';

export const blacklistRoutes = [
  {
    path: 'blacklist',
    lazy: async () => {
      const { default: BlacklistTabs } = await import('../../pages/blacklist/Tabs');
      return {
        Component: () => <BlacklistTabs />
      };
    },
    children: [
      {
        index: true,
        element: <Navigate to="./tab/ip" />
      },
      {
        path: 'tab/ip',
        lazy: async () => {
          const { default: BlacklistIP } = await import('../../pages/blacklist/ip/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.LIST}>
                <BlacklistIP />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'tab/email-phone',
        lazy: async () => {
          const { default: BlacklistEmailPhone } = await import(
            '../../pages/blacklist/email-phone/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.LIST}>
                <BlacklistEmailPhone />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default blacklistRoutes;
