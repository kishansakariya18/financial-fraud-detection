// Import Dependencies
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import {
  TbCategoryPlus
  // , TbPalette
} from 'react-icons/tb';

export const frontend = {
  id: 'frontend',
  type: NAV_TYPE_COLLAPSE,
  path: '/web',
  title: 'Frontend',
  transKey: 'frontend',
  Icon: ComputerDesktopIcon,
  permission: [PERMISSIONS.FRONTEND.VIEW, PERMISSIONS.FRONTEND.LAYOUT_THEME.VIEW],
  childs: [
    {
      id: 'homeCategory',
      path: '/web/home-category',
      type: NAV_TYPE_ITEM,
      title: 'homeCategory',
      transKey: 'homeCategory',
      Icon: TbCategoryPlus,
      permission: PERMISSIONS.FRONTEND.VIEW
    },
    {
      id: 'layoutTheme',
      path: '/layout/layout-theme',
      type: NAV_TYPE_ITEM,
      title: 'layoutTheme',
      transKey: 'layoutTheme',
      Icon: TbCategoryPlus,
      permission: PERMISSIONS.FRONTEND.LAYOUT_THEME.VIEW
    }
    // ,
    // {
    //   id: 'appearance',
    //   path: '/web/appearance',
    //   type: NAV_TYPE_ITEM,
    //   title: 'appearance',
    //   transKey: 'appearance',
    //   Icon: TbPalette,
    //   permission: PERMISSIONS.FRONTEND.APPEARANCE_VIEW
    // }
  ]
};
