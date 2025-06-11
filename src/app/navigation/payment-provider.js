// Import Dependencies
import { BanknotesIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
export const paymentProvider = {
  id: 'payment-provider',
  type: NAV_TYPE_ITEM,
  path: '/payment-provider',
  title: 'Audit Logs',
  transKey: 'payment-provider',
  Icon: BanknotesIcon,
  permission: PERMISSIONS.PAYMENT_PROVIDER.VIEW
};
