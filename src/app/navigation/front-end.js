// Import Dependencies
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import { TbCategoryPlus, TbPalette } from 'react-icons/tb';

export const frontend = {
  id: 'frontend',
  type: NAV_TYPE_COLLAPSE,
  title: 'Frontend',
  transKey: 'frontend',
  Icon: ComputerDesktopIcon,
  permission: [PERMISSIONS.FRONTEND.VIEW, PERMISSIONS.FRONTEND.APPEARANCE_VIEW],
  childs: [
    {
      id: 'homeCategory',
      path: '/home-category',
      type: NAV_TYPE_ITEM,
      title: 'homeCategory',
      transKey: 'homeCategory',
      Icon: TbCategoryPlus,
      permission: PERMISSIONS.FRONTEND.VIEW
    },
    {
      id: 'appearance',
      path: '/appearance/list',
      type: NAV_TYPE_ITEM,
      title: 'appearance',
      transKey: 'appearance',
      Icon: TbPalette,
      permission: PERMISSIONS.FRONTEND.APPEARANCE_VIEW
    }
  ]
};
