// Import Dependencies
import { RxDragHandleDots2 } from 'react-icons/rx';
import {
  PuzzlePieceIcon,
  Squares2X2Icon,
  UserPlusIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';
// Local Imports
// import SettingIcon from 'assets/dualicons/setting.svg?react';
import {
  NAV_TYPE_COLLAPSE,
  NAV_TYPE_ITEM,
  PERMISSIONS,
  PLATFORM_TYPE
} from 'constants/app.constant';

export const casinoManagement = {
  id: 'casino_management',
  type: NAV_TYPE_COLLAPSE,
  path: '/casino',
  title: 'Casino Management',
  transKey: 'casino_management',
  Icon: RxDragHandleDots2,
  permission: [
    PERMISSIONS.CATEGORY.VIEW,
    PERMISSIONS.PROVIDER.VIEW,
    PERMISSIONS.AGGREGATOR.VIEW,
    PERMISSIONS.GAME.VIEW
  ],
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
      id: 'casino_aggregator',
      type: NAV_TYPE_ITEM,
      path: '/casino/aggregator/list',
      title: 'Aggregator List',
      transKey: 'casino_aggregator',
      Icon: Squares2X2Icon,
      permission: PERMISSIONS.AGGREGATOR.VIEW
    },
    {
      id: 'casino_currencies',
      type: NAV_TYPE_ITEM,
      path: '/casino-management/currencies',
      title: 'Currency',
      transKey: 'casino_currencies',
      Icon: HiOutlineCurrencyRupee, // Please replace with the correct icon
      permission: null, // Please replace with the correct permission
      platformType: [PLATFORM_TYPE.B2C]
    },
    {
      id: 'casino_games',
      type: NAV_TYPE_ITEM,
      path: '/casino/games/list',
      title: 'Games List',
      transKey: 'casino_games',
      Icon: PuzzlePieceIcon,
      permission: PERMISSIONS.GAME.VIEW
    }
  ]
};
