import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';
import { Navigate } from 'react-router';

export const affiliatesRoutes = [
  {
    path: 'affiliates',
    lazy: async () => {
      const { default: AffiliatesList } = await import('../../pages/affiliates/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.LIST}>
            <AffiliatesList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/:affiliateId/detail',
    lazy: async () => {
      const { default: AffiliateDetails } = await import('../../pages/affiliates/details');
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
    path: 'affiliates/:affiliateId/commission-summary',
    lazy: async () => {
      const { default: CommissionSummary } = await import('../../pages/affiliates/commission/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.COMMISSION_SUMMARY}>
            <CommissionSummary />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/:affiliateId/users',
    lazy: async () => {
      const { default: AffiliateUsersList } = await import('../../pages/affiliates/users/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.USER_SIGNUP_LIST}>
            <AffiliateUsersList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/:affiliateId/withdrawals',
    lazy: async () => {
      const { default: AffiliateWithdrawalsList } = await import(
        '../../pages/affiliates/withdrawals/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.WITHDRAWALS_LIST}>
            <AffiliateWithdrawalsList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/:affiliateId/tab',
    lazy: async () => ({
      Component: (await import('../../pages/affiliates/Tabs')).default
    }),
    children: [
      {
        index: true,
        element: <Navigate to="./details" />
      },
      {
        path: 'details',
        lazy: async () => {
          const { default: AffiliateDetails } = await import('../../pages/affiliates/details');
          return {
            Component: () => (
              <>
                <PrivateRoute permission={PERMISSIONS.AFFILIATES.LIST}>
                  <AffiliateDetails />
                </PrivateRoute>
              </>
            )
          };
        }
      },
      {
        path: 'campaigns',
        lazy: async () => {
          const { default: AffiliateCampaignsList } = await import(
            '../../pages/affiliates/campaigns/list'
          );
          return {
            Component: () => (
              <>
                <PrivateRoute permission={PERMISSIONS.AFFILIATES.LIST}>
                  <AffiliateCampaignsList />
                </PrivateRoute>
              </>
            )
          };
        }
      },
      {
        path: 'campaigns/:campaignUID/detail',
        lazy: async () => {
          const { default: AffiliateCampaignDetails } = await import(
            '../../pages/affiliates/campaigns/ViewDetails'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST}>
                <AffiliateCampaignDetails />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'campaigns/:campaignID/referred_users',
        lazy: async () => {
          const { default: AffiliateCampaignReferredUsers } = await import(
            '../../pages/affiliates/campaigns/referred-users/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST}>
                <AffiliateCampaignReferredUsers />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'referred_users',
        lazy: async () => {
          const { default: AffiliateUsersList } = await import('../../pages/affiliates/users/list');
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.USER_SIGNUP_LIST}>
                <AffiliateUsersList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'referred_users/:userID/transactions',
        lazy: async () => {
          const { default: AffiliateUsersTransactionsList } = await import(
            '../../pages/affiliates/users/transactions/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.USER_SIGNUP_LIST}>
                <AffiliateUsersTransactionsList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'withdrawals',
        lazy: async () => {
          const { default: AffiliateWithdrawalsList } = await import(
            '../../pages/affiliates/withdrawals/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.WITHDRAWALS_LIST}>
                <AffiliateWithdrawalsList />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'commission',
        lazy: async () => {
          const { default: CommissionSummary } = await import(
            '../../pages/affiliates/commission/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.COMMISSION_SUMMARY}>
                <CommissionSummary />
              </PrivateRoute>
            )
          };
        }
      }
    ]
  }
];

export default affiliatesRoutes;
