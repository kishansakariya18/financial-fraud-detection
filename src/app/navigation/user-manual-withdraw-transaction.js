import { PiHandDepositThin } from 'react-icons/pi';
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
export const userManualWithdrawTransaction = {
  id: 'user-manual-withdraw-transaction',
  type: NAV_TYPE_ITEM,
  path: '/user-manual-withdraw-transaction',
  title: 'User Manual Withdraw',
  transKey: 'user_manual_deposit_transaction_view',
  Icon: PiHandDepositThin,
  permission: PERMISSIONS.USER_MANUAL_DEPOSIT_TRANSACTION.VIEW,
  platformType: [PLATFORM_TYPE.B2C]
};
