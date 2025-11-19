// Import Dependencies
import { FiUserCheck } from 'react-icons/fi';

// Local Imports
import { NAV_TYPE_COLLAPSE, PERMISSIONS } from 'constants/app.constant';
import { playerKycRecords } from './player-kyc-records';
import { kycConfigurations } from './kyc-configuration';

export const kyc = {
  id: 'kyc',
  type: NAV_TYPE_COLLAPSE,
  path: '/kyc',
  title: 'KYC',
  transKey: 'kyc',
  Icon: FiUserCheck,
  permission: [PERMISSIONS.USER_KYC.VIEW],
  childs: [playerKycRecords, kycConfigurations]
};
