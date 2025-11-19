// Import Dependencies
import { PiListChecks } from 'react-icons/pi';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const playerKycRecords = {
  id: 'player-kyc-records',
  type: NAV_TYPE_ITEM,
  path: '/kyc/player-kyc-records',
  title: 'User KYC',
  transKey: 'playerKycRecords',
  Icon: PiListChecks,
  permission: PERMISSIONS.USER_KYC.VIEW,
  platformType: [PLATFORM_TYPE.B2C]
};
