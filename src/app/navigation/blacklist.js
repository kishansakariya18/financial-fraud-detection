import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const blacklist = {
  id: 'blacklist',
  path: '/blacklist',
  type: NAV_TYPE_ITEM,
  title: 'Blacklist',
  transKey: 'blacklist',
  Icon: ShieldExclamationIcon,
  permission: [
    PERMISSIONS.BLACKLIST.VIEW,
    PERMISSIONS.BLACKLIST.VIEW_EMAIL_MOBILE_RESTRCTION,
    PERMISSIONS.BLACKLIST.VIEW_RESTRICTED_EMAIL_DOMAIN
  ]
};
