import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';
import { Navigate } from 'react-router';

export const userKycRoute = [
  {
    path: 'user-kyc',
    lazy: async () => {
      const { default: UserKycList } = await import('../../pages/player-kyc/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_KYC.VIEW}>
            <UserKycList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'user-kyc/:documentId/tab',
    lazy: async () => ({
      Component: (await import('../../pages/player-kyc/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { ViewDetails } = await import('../../pages/player-kyc/ViewDetails');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER_KYC.VIEW}>
                <ViewDetails />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default userKycRoute;
