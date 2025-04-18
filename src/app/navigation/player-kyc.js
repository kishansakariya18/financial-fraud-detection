// Local Imports
import { IdentificationIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const playerKyc = {
  id: 'player-kyc',
  type: NAV_TYPE_ITEM,
  path: '/player-kyc',
  title: 'User KYC',
  transKey: 'playerKyc',
  Icon: IdentificationIcon,
  permission: PERMISSIONS.USER_KYC.VIEW
};
