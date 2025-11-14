// Import Dependencies
import { DocumentIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const pages = {
  id: 'pages',
  type: NAV_TYPE_ITEM,
  path: '/content-management/pages',
  title: 'Pages',
  transKey: 'pages',
  Icon: DocumentIcon,
  permission: PERMISSIONS.PAGE.VIEW
};
