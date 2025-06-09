// Import Dependencies
import { FolderIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, PERMISSIONS } from 'constants/app.constant';
import { banner } from './banner';
import { pages } from './pages';

export const contentManagement = {
  id: 'content.management',
  type: NAV_TYPE_COLLAPSE,
  path: '/content-management',
  title: 'Content Management',
  transKey: 'content_management',
  Icon: FolderIcon,
  permission: [PERMISSIONS.PAGE.LIST, PERMISSIONS.BANNER.LIST],
  childs: [pages, banner]
};
