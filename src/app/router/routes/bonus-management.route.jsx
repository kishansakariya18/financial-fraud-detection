import PrivateRoute from '../private';
import { PERMISSIONS } from 'constants/app.constant';

export const bonusManagementRoute = [
  {
    path: 'bonus/referral-management',
    lazy: async () => {
      const { default: ReferralManagement } = await import(
        '../../pages/referral-management/ReferralManagement'
      );
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.REFERRAL_MANAGEMENT.VIEW}>
            <ReferralManagement />
          </PrivateRoute>
        )
      };
    }
  }
];

export default bonusManagementRoute;
