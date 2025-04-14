// Import Dependencies
import {
  CircleStackIcon,
  PuzzlePieceIcon,
  UserPlusIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';

// Local Imports
// import SettingIcon from 'assets/dualicons/setting.svg?react';
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const casinoManagement = {
  id: 'casino_management',
  type: NAV_TYPE_COLLAPSE,
  title: 'Casino Management',
  transKey: 'casino_management',
  Icon: CircleStackIcon,
  permission: [PERMISSIONS.CATEGORY.VIEW],
  childs: [
    {
      id: 'casino_category',
      type: NAV_TYPE_ITEM,
      path: '/casino/category/list',
      title: 'Category List',
      transKey: 'casino_category',
      Icon: ViewColumnsIcon,
      permission: PERMISSIONS.CATEGORY.VIEW
    },
    {
      id: 'casino_provider',
      type: NAV_TYPE_ITEM,
      path: '/casino/provider/list',
      title: 'Provider List',
      transKey: 'casino_provider',
      Icon: UserPlusIcon,
      permission: PERMISSIONS.PROVIDER.VIEW
    },
    {
      id: 'casino_games',
      type: NAV_TYPE_ITEM,
      path: '/casino/games/list',
      title: 'Games List',
      transKey: 'casino_games',
      Icon: PuzzlePieceIcon,
      permission: PERMISSIONS.PROVIDER.VIEW
    }
  ]
};
