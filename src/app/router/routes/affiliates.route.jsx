import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';
import { Navigate } from 'react-router';

export const affiliatesRoutes = [
  {
    path: 'affiliates/users',
    lazy: async () => {
      const { default: AffiliatesList } = await import('../../pages/affiliates/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.VIEW}>
            <AffiliatesList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/users/create',
    lazy: async () => {
      const { default: CreateAffiliate } = await import('../../pages/affiliates/CreateAffiliate');
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
    path: 'affiliates/users/:affiliateId/detail',
    lazy: async () => {
      const { default: AffiliateDetails } = await import('../../pages/affiliates/details');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.VIEW}>
            <AffiliateDetails />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/users/:affiliateId/edit',
    lazy: async () => {
      const { default: EditAffiliate } = await import('../../pages/affiliates/EditAffiliates');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.EDIT}>
            <EditAffiliate />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/users/:affiliateId/commission-summary',
    lazy: async () => {
      const { default: CommissionSummary } = await import('../../pages/affiliates/commission/list');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.COMMISSION_SETTING}>
            <CommissionSummary />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/users/:affiliateId/users',
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
    path: 'affiliates/users/:affiliateId/withdrawals',
    lazy: async () => {
      const { default: AffiliateWithdrawalsList } = await import(
        '../../pages/affiliates/withdrawals/list'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.AFFILIATES.TRANSACTIONS}>
            <AffiliateWithdrawalsList />
          </PrivateRoute>
        )
      };
    }
  },
  {
    path: 'affiliates/users/:affiliateId/tab',
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
                <PrivateRoute permission={PERMISSIONS.AFFILIATES.VIEW}>
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
                <PrivateRoute permission={PERMISSIONS.AFFILIATES.CAMPAIGN.VIEW}>
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
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.CAMPAIGN.VIEW}>
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
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.USER_SIGNUP_LIST}>
                <AffiliateCampaignReferredUsers />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'campaigns/:campaignID/referred_users/:userID/transactions',
        lazy: async () => {
          const { default: AffiliateCampaignReferredUsersTransactions } = await import(
            '../../pages/affiliates/campaigns/referred-users/transactions/list'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.TRANSACTIONS}>
                <AffiliateCampaignReferredUsersTransactions />
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
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.PAYOUT}>
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
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.C}>
                <CommissionSummary />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'commission-settings',
        lazy: async () => {
          const { default: CommissionSettings } = await import(
            '../../pages/affiliates/commission-settings'
          );
          return {
            Component: () => (
              <PrivateRoute permission={PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST}>
                <CommissionSettings />
              </PrivateRoute>
            )
          };
        }
      },
      {
        path: 'transactions',
        lazy: async () => {
          const { default: AffiliateTransactionsList } = await import(
            '../../pages/affiliates/transactions/list'
          );
          return {
            Component: () => (
              <>
                <PrivateRoute permission={PERMISSIONS.AFFILIATES.TRANSACTIONS_LIST}>
                  <AffiliateTransactionsList />
                </PrivateRoute>
              </>
            )
          };
        }
      }
    ]
  }
];

export default affiliatesRoutes;
