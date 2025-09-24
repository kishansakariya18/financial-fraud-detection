// Import Dependencies
import { UsersIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const affiliatesNew = {
  id: 'affiliates.new',
  type: NAV_TYPE_ITEM,
  path: '/affiliates',
  title: 'Affiliates',
  transKey: 'affiliates',
  Icon: UsersIcon,
  permission: PERMISSIONS.AFFILIATES.LIST
};
