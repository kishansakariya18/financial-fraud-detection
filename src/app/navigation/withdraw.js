// Import Dependencies
import { BanknotesIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
export const withdraw = {
  id: 'withdraw',
  type: NAV_TYPE_ITEM,
  path: '/withdraw',
  title: 'Withdraw',
  transKey: 'withdraw',
  Icon: BanknotesIcon,
  permission: PERMISSIONS.BANK.VIEW,
  platformType: [PLATFORM_TYPE.B2C]
};
