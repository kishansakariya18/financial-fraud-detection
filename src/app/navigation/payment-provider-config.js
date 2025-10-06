import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const paymentProviderConfig = {
  id: 'payment_provider',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/payment-provider-config',
  title: 'Payment Provider',
  transKey: 'paymentProvider',
  Icon: Cog6ToothIcon,
  permission: PERMISSIONS.PAYMENT_PROVIDER.LIST,
  platformType: PLATFORM_TYPE.B2C
};

export default paymentProviderConfig;
