// Import Dependencies
import { UserPlusIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const affliate = {
  id: 'affiliate',
  type: NAV_TYPE_ITEM,
  path: '/affiliate',
  title: 'Affiliates',
  transKey: 'affiliates',
  Icon: UserPlusIcon,
  permission: PERMISSIONS.AFFILIATES.LIST
};
