// Local Imports
import { IdentificationIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const playerKyc = {
  id: 'user-kyc',
  type: NAV_TYPE_ITEM,
  path: '/user-kyc',
  title: 'User KYC',
  transKey: 'playerKyc',
  Icon: IdentificationIcon,
  permission: PERMISSIONS.USER_KYC.VIEW
};
