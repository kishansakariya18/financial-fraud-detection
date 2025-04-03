// Import Dependencies
import { FlagIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const country = {
  id: 'country',
  type: NAV_TYPE_ITEM,
  path: '/country',
  title: 'Country',
  transKey: 'country',
  Icon: FlagIcon,
  permission: PERMISSIONS.COUNTRIES.LIST
};
