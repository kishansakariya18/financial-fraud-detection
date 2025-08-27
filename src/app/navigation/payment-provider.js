// Import Dependencies
import { TbCreditCardPay } from 'react-icons/tb';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
export const paymentProvider = {
  id: 'payment-provider',
  type: NAV_TYPE_ITEM,
  path: '/payment-provider',
  title: 'Payment Provider',
  transKey: 'payment_provider',
  Icon: TbCreditCardPay,
  permission: PERMISSIONS.PAYMENT_PROVIDER.VIEW
};
