// import { Navigate } from "react-router";

import { Navigate } from 'react-router';
import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';

export const playerRoutes = [
  {
    path: 'users/player',
    lazy: async () => {
      const { default: PlayerList } = await import('../../pages/users/player/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER.LIST}>
            <PlayerList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'users/player/:playerId/:userID/tab',
    lazy: async () => ({
      Component: (await import('../../pages/users/player/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { ViewDetails: PlayerDetails } = await import(
            '../../pages/users/player/ViewDetails'
          );
          // const { default: PlayerLimit } = await import(
          //   '../../pages/users/player/ViewOnlyPlayerLimit'
          // );
          return {
            Component: () => (
              <>
                <PrivateRoute permission={PERMISSIONS.USER.LIST}>
                  <PlayerDetails />
                </PrivateRoute>
                {/* <PrivateRoute permission={PERMISSIONS.USER.USER_LEVEL_LIMITS}>
                  <PlayerLimit />
                </PrivateRoute> */}
              </>
            )
          };
        }
      },
      {
        path: 'limits',
        lazy: async () => {
          const { default: PlayerLimit } = await import('../../pages/users/player/PlayerLimit');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.USER_LEVEL_LIMITS}>
                <PlayerLimit />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'transactions',
        lazy: async () => {
          const { default: TransactionList } = await import(
            '../../pages/users/player/transaction-list/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.TRANSACTION}>
                <TransactionList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'login-history',
        lazy: async () => {
          const { default: LoginHistory } = await import(
            '../../pages/users/player/login-history/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.VIEW_LOGIN_HISTORY}>
                <LoginHistory />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'manage-fund',
        lazy: async () => {
          const { default: ManageFund } = await import('../../pages/users/player/ManageFund');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.ADD_MONEY}>
                <ManageFund />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'player-notes',
        lazy: async () => {
          const { default: PlayerNoteList } = await import(
            '../../pages/users/player/player-notes/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.COMMENT_VIEW}>
                <PlayerNoteList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'referrals',
        lazy: async () => {
          const { default: ReferralList } = await import(
            '../../pages/users/player/referral-list/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.COMMENT_VIEW}>
                <ReferralList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'change-profile',
        lazy: async () => {
          const { default: Profile } = await import('../../pages/profile/Profile');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.LIST}>
                <Profile />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'change-password',
        lazy: async () => {
          const { default: ChangePassword } = await import('../../pages/profile/ChangePassword');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.LIST}>
                <ChangePassword />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'wallets',
        lazy: async () => {
          const { default: PlayerWallets } = await import('../../pages/users/player/wallets/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.LIST}>
                <PlayerWallets />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default playerRoutes;
