// import { Navigate } from "react-router";

import { Navigate } from 'react-router';
import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';

export const playerRoutes = [
  {
    path: 'player',
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
    path: 'player/:playerId/tab',
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
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.USER.LIST}>
                <PlayerDetails />
              </PrivateRoute>
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
      }
    ]
  }
];

export default playerRoutes;
