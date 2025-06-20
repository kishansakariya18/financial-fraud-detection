// Import Dependencies
import { MegaphoneIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const banner = {
  id: 'banner',
  type: NAV_TYPE_ITEM,
  path: '/banner',
  title: 'Banner',
  transKey: 'nav.banner',
  // disabled: true,
  Icon: MegaphoneIcon,
  permission: PERMISSIONS.BANNER.LIST
};
