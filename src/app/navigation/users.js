// Import Dependencies
import { UserIcon, UsersIcon } from '@heroicons/react/24/outline';

// Local Imports
import SettingIcon from 'assets/dualicons/setting.svg?react';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const users = {
  id: 'users',
  type: NAV_TYPE_ITEM,
  path: '/users',
  title: 'Users',
  transKey: 'nav.users.users',
  Icon: SettingIcon,
  permission: [PERMISSIONS.ADMIN.LIST, PERMISSIONS.USER.LIST],
  childs: [
    {
      id: 'admin',
      type: NAV_TYPE_ITEM,
      path: '/admin',
      title: 'General',
      transKey: 'nav.users.admin',
      Icon: UserIcon,
      permission: PERMISSIONS.ADMIN.LIST
    },
    {
      id: 'players',
      type: NAV_TYPE_ITEM,
      path: '/player',
      title: 'Players',
      transKey: 'nav.users.players',
      Icon: UsersIcon,
      permission: PERMISSIONS.USER.LIST
    }
  ]
};
