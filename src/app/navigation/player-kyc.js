// Import Dependencies
import { GoVerified } from 'react-icons/go';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const playerKyc = {
  id: 'player-kyc',
  type: NAV_TYPE_ITEM,
  path: '/player-kyc',
  title: 'User KYC',
  transKey: 'playerKyc',
  Icon: GoVerified,
  permission: PERMISSIONS.USER_KYC.VIEW
};
