// Import Dependencies
import { ComputerDesktopIcon, TagIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const frontend = {
  id: 'frontend',
  type: NAV_TYPE_COLLAPSE,
  title: 'Frontend',
  transKey: 'frontend',
  Icon: ComputerDesktopIcon,
  permission: [PERMISSIONS.FRONTEND.VIEW],
  childs: [
    {
      id: 'homeCategory',
      path: '/home-category',
      type: NAV_TYPE_ITEM,
      title: 'homeCategory',
      transKey: 'homeCategory',
      Icon: TagIcon,
      permission: PERMISSIONS.FRONTEND.VIEW
    }
  ]
};
