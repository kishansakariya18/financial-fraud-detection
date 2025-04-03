// Import Dependencies
import { TicketIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const platform = {
  id: 'limit',
  type: NAV_TYPE_ITEM,
  path: '/platform-limit',
  title: 'Platform',
  transKey: 'nav.platform.limit',
  Icon: TicketIcon,
  permission: PERMISSIONS.USER_LIMIT_SETTING.UPDATE
};
