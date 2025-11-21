import { PERMISSIONS } from 'constants/app.constant';
import PrivateRoute from '../private';

export const kycConfigurationsRoute = [
  {
    path: 'kyc/kyc-configurations',
    lazy: async () => {
      const { default: KycConfigurations } = await import('../../pages/kyc-configurations/index');
      return {
        Component: () => (
          <PrivateRoute permission={PERMISSIONS.USER_KYC.KYC_CONFIGURATIONS}>
            <KycConfigurations />
          </PrivateRoute>
        )
      };
    }
  }
];

export default kycConfigurationsRoute;
