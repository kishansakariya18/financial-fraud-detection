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
              <PrivateRoute permission={PERMISSIONS.BLACKLIST.LIST}>
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
              <PrivateRoute permission={PERMISSIONS.BLACKLIST.LIST}>
                <BlacklistEmailPhone />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'tab/disposable-email',
        lazy: async () => {
          const { default: DisposableEmailList } = await import(
            '../../pages/blacklist/disposable-email/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.BLACKLIST.LIST}>
                <DisposableEmailList />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  },
  {
    path: 'blacklist/ip',
    lazy: async () => {
      const { default: BlacklistIP } = await import('../../pages/blacklist/BlacklistIP');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLACKLIST.LIST}>
            <BlacklistIP />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'blacklist/email-phone',
    lazy: async () => {
      const { default: BlacklistEmailPhone } = await import(
        '../../pages/blacklist/BlacklistEmailPhone'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLACKLIST.LIST}>
            <BlacklistEmailPhone />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'blacklist/disposable-email',
    lazy: async () => {
      const { default: DisposableEmailList } = await import(
        '../../pages/blacklist/disposable-email/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.BLACKLIST.LIST}>
            <DisposableEmailList />
          </PrivateRoute>
        )
      };
    }
  }
];

export default blacklistRoutes;
