// import { Navigate } from "react-router";

import { Navigate } from 'react-router';
import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';

export const affiliateRoutes = [
  {
    path: 'affiliate',
    lazy: async () => {
      const { default: AffiliateList } = await import('../../pages/affiliate/list/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.LIST}>
            <AffiliateList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliate/:affiliateId/tab',
    lazy: async () => ({
      Component: (await import('../../pages/affiliate/ViewDetails')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { ViewDetails: AffiliateDetails } = await import(
            '../../pages/affiliate/ViewDetails'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.LIST}>
                <AffiliateDetails />
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
  },
  {
    path: 'affiliate/create',
    lazy: async () => {
      const { default: CreateAffiliate } = await import('../../pages/affiliate/CreateAffiliate');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.ADD}>
            <CreateAffiliate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliate/:affiliateId/edit',
    lazy: async () => {
      const { default: EditAffiliate } = await import('../../pages/affiliate/EditAffiliate');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.EDIT}>
            <EditAffiliate />
          </PrivateRoute>
        )
      };
    }
  }
];

export default affiliateRoutes;
