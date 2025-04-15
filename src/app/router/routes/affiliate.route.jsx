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
      Component: (await import('../../pages/affiliate/Tabs')).default
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
        path: 'player-list',
        lazy: async () => {
          const { default: PlayerList } = await import('../../pages/affiliate/player-list/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.USER_SIGNUP_LIST}>
                <PlayerList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'transaction-list',
        lazy: async () => {
          const { default: TransactionList } = await import(
            '../../pages/affiliate/transaction-list/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.TRANSACTIONS}>
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
            '../../pages/affiliate/login-history/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.VIEW_LOGIN_HISTORY}>
                <LoginHistory />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'payout-history',
        lazy: async () => {
          const { default: PayoutHistory } = await import(
            '../../pages/affiliate/payout-history/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.PAYOUT}>
                <PayoutHistory />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'manage-fund',
        lazy: async () => {
          const { default: ManageFund } = await import('../../pages/affiliate/ManageFund');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.ADD_MONEY}>
                <ManageFund />
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
