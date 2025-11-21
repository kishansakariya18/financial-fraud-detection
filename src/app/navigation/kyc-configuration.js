// Import Dependencies
import { TbAdjustmentsCheck } from 'react-icons/tb';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const kycConfigurations = {
  id: 'kyc-configurations',
  type: NAV_TYPE_ITEM,
  path: '/kyc/kyc-configurations',
  title: 'KYC Configurations',
  transKey: 'kycConfigurations',
  Icon: TbAdjustmentsCheck,
  permission: PERMISSIONS.USER_KYC.KYC_CONFIGURATIONS
};
