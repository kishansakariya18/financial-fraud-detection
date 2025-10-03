// Import Dependencies
import { PiHandDepositThin } from 'react-icons/pi';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
export const userManualDepositTransaction = {
  id: 'user-manual-deposit-transaction',
  type: NAV_TYPE_ITEM,
  path: '/user-manual-deposit-transaction',
  title: 'User Manual Deposit',
  transKey: 'user_manual_deposit_transaction_view',
  Icon: PiHandDepositThin,
  permission: PERMISSIONS.USER_MANUAL_DEPOSIT_TRANSACTION.VIEW,
  platformType: [PLATFORM_TYPE.B2C]
};
