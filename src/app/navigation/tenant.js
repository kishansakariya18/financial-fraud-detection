// Import Dependencies

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export const tenants = {
  id: 'tenant',
  type: NAV_TYPE_ITEM,
  path: '/tenant',
  title: 'Tenant',
  transKey: 'tenants',
  Icon: UserGroupIcon,
  permission: PERMISSIONS.TENANT.VIEW,
  platformType: [PLATFORM_TYPE.B2C]
};
