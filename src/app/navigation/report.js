// Import Dependencies
import { BookOpenIcon } from '@heroicons/react/24/outline';

// Local Imports
import SettingIcon from 'assets/dualicons/setting.svg?react';
import { NAV_TYPE_ITEM } from 'constants/app.constant';

export const reports = {
  id: 'report',
  type: NAV_TYPE_ITEM,
  path: '/report',
  title: 'report',
  transKey: 'report',
  Icon: SettingIcon,
  childs: [
    {
      id: 'report',
      type: NAV_TYPE_ITEM,
      path: '/report',
      title: 'report',
      transKey: 'report',
      Icon: BookOpenIcon
    }
  ]
};
