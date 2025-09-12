import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const emailProvider = {
  id: 'email_provider',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/email-provider',
  title: 'Email Provider',
  transKey: 'emailProvider',
  Icon: Cog6ToothIcon,
  permission: [PERMISSIONS.EMAIL_PROVIDER.LIST]
};

export default emailProvider;
