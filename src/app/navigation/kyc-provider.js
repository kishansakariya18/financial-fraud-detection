import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const kycProvider = {
  id: 'kyc_provider',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/kyc-provider',
  title: 'KYC Provider',
  transKey: 'kycProvider',
  Icon: Cog6ToothIcon,
  permission: PERMISSIONS.KYC_PROVIDER.LIST,
  platformType: [PLATFORM_TYPE.B2C]
};

export default kycProvider;
