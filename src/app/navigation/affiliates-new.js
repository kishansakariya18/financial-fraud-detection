// Import Dependencies
import { UsersIcon } from '@heroicons/react/20/solid';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const affiliatesNew = {
  id: 'affiliates.new',
  type: NAV_TYPE_ITEM,
  path: '/affiliates',
  title: 'Affiliates',
  transKey: 'affiliates',
  Icon: UsersIcon,
  permission: PERMISSIONS.AFFILIATES.LIST,
  platformType: [PLATFORM_TYPE.B2C]
};
