// Import Dependencies
import { BanknotesIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
export const bank = {
  id: 'bank',
  type: NAV_TYPE_ITEM,
  path: '/bank',
  title: 'Bank',
  transKey: 'bank',
  Icon: BanknotesIcon,
  permission: PERMISSIONS.DEPOSIT_BANK.VIEW,
  platformType: [PLATFORM_TYPE.B2C]
};
