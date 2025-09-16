import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const smsProvider = {
  id: 'sms_provider',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/sms-provider',
  title: 'SMS Provider',
  transKey: 'smsProvider',
  Icon: Cog6ToothIcon,
  permission: PERMISSIONS.SMS_PROVIDER.LIST
};

export default smsProvider;
