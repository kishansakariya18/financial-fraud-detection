// Import Dependencies
import { CommandLineIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
export const auditlogs = {
  id: 'auditlogs',
  type: NAV_TYPE_ITEM,
  path: '/auditlogs',
  title: 'Audit Logs',
  transKey: 'auditlogs',
  Icon: CommandLineIcon,
  permission: PERMISSIONS.AUDIT_LOGS.VIEW
};
