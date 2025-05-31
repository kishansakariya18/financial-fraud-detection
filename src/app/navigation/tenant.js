// Import Dependencies

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export const tenants = {
  id: 'tenant',
  type: NAV_TYPE_ITEM,
  title: 'Tenant',
  transKey: 'tenants',
  Icon: UserGroupIcon,
  permission: PERMISSIONS.TENANT.VIEW
};
