// Import Dependencies
import { FlagIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const country = {
  id: 'country',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/country',
  title: 'Country Restrictions',
  transKey: 'countryRestrictions',
  Icon: FlagIcon,
  permission: PERMISSIONS.COUNTRIES.LIST
};
