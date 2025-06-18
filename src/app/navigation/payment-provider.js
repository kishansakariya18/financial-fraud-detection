// Import Dependencies
import { BanknotesIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
export const paymentProvider = {
  id: 'payment-provider',
  type: NAV_TYPE_ITEM,
  path: '/payment-provider',
  title: 'Payment Provider',
  transKey: 'payment_provider',
  Icon: BanknotesIcon,
  permission: PERMISSIONS.PAYMENT_PROVIDER.VIEW
};
