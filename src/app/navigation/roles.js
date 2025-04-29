// Import Dependencies
import { IdentificationIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const roles = {
  id: 'roles',
  type: NAV_TYPE_ITEM,
  path: '/roles',
  title: 'Roles',
  transKey: 'roles',
  Icon: IdentificationIcon,
  permission: PERMISSIONS.ROLES.VIEW
};
