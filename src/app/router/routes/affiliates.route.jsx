import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';

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
  }
];

export default affiliatesRoutes;
