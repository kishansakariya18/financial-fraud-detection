// Import Dependencies
import { BanknotesIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
export const userManualDepositTransaction = {
  id: 'user-manual-deposit-transaction',
  type: NAV_TYPE_ITEM,
  path: '/user-manual-deposit-transaction',
  title: 'User Manual Deposit',
  transKey: 'user_manual_deposit_transaction_view',
  Icon: BanknotesIcon,
  permission: PERMISSIONS.USER_MANUAL_DEPOSIT_TRANSACTION.VIEW
};
