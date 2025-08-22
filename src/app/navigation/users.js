// Import Dependencies
import { UserCircleIcon } from '@heroicons/react/20/solid';
import { UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const users = {
  id: 'users.users',
  type: NAV_TYPE_COLLAPSE,
  path: '/users',
  title: 'Users',
  transKey: 'nav.users.users',
  Icon: UsersIcon,
  permission: [PERMISSIONS.USER.LIST, PERMISSIONS.ADMIN.LIST, PERMISSIONS.AFFILIATES.LIST],
  childs: [
    {
      id: 'users.admin',
      path: '/users/admin',
      type: NAV_TYPE_ITEM,
      title: 'Admin',
      transKey: 'nav.users.admin',
      Icon: UserCircleIcon,
      permission: PERMISSIONS.ADMIN.LIST
    },
    {
      id: 'users.players',
      path: '/users/player',
      type: NAV_TYPE_ITEM,
      title: 'Players',
      transKey: 'nav.users.players',
      Icon: UserGroupIcon,
      permission: PERMISSIONS.USER.LIST
    }
    // ,
    // {
    //   id: 'affiliate',
    //   type: NAV_TYPE_ITEM,
    //   path: '/users/affiliate',
    //   title: 'Affiliates',
    //   transKey: 'affiliates',
    //   Icon: UsersIcon,
    //   permission: PERMISSIONS.AFFILIATES.LIST
    // }
  ]
};
