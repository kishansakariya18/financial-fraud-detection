// Import Dependencies
import { TicketIcon } from '@heroicons/react/24/outline';

// Local Imports
import SettingIcon from 'assets/dualicons/setting.svg?react';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const platform = {
  id: 'platform',
  type: NAV_TYPE_ITEM,
  path: '/platform',
  title: 'Platoform',
  transKey: 'nav.platform.platform',
  Icon: SettingIcon,
  permission: [PERMISSIONS.USER_LIMIT_SETTING.VIEW],
  childs: [
    {
      id: 'limit',
      type: NAV_TYPE_ITEM,
      path: '/platform-limit',
      title: 'Platform',
      transKey: 'nav.platform.limit',
      Icon: TicketIcon,
      permission: PERMISSIONS.USER_LIMIT_SETTING.UPDATE
    }
  ]
};
