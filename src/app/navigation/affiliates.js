// Import Dependencies
import { UsersIcon } from '@heroicons/react/20/solid';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const affliate = {
  id: 'affiliate',
  type: NAV_TYPE_ITEM,
  path: '/users/affiliate',
  title: 'Affiliates',
  transKey: 'affiliates',
  Icon: UsersIcon,
  permission: PERMISSIONS.AFFILIATES.LIST
};
