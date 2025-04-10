// Import Dependencies
import { CircleStackIcon, QueueListIcon } from '@heroicons/react/24/outline';

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
      Icon: QueueListIcon,
      permission: PERMISSIONS.CATEGORY.VIEW
    }
  ]
};
