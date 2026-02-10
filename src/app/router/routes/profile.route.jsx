import { PLATFORM_TYPE } from 'constants/app.constant';
import { Navigate } from 'react-router';
import PrivateRoute from '../private';

export const profileRoute = [
  {
    path: 'profile',
    lazy: async () => ({
      Component: (await import('../../pages/profile/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./change-profile" />
      },
      {
        path: 'change-profile',
        lazy: async () => {
          const { default: Profile } = await import('../../pages/profile/Profile');
          return {
            Component: () => <Profile />
          };
        }
      },
      {
        path: 'change-password',
        lazy: async () => {
          const { default: ChangePassword } = await import('../../pages/profile/ChangePassword');
          return {
            Component: () => <ChangePassword />
          };
        }
      },
      {
        path: 'player-fund-password',
        lazy: async () => {
          const { default: PlayerFundPassword } = await import(
            '../../pages/profile/PlayerFundPassword'
          );
          return {
            Component: () => (
              <PrivateRoute allowedPlatforms={[PLATFORM_TYPE.B2C]}>
                <PlayerFundPassword />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default profileRoute;
