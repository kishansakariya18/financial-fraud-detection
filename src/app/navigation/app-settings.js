// Import Dependencies
import { LuSettings2 } from 'react-icons/lu';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';
console.log('application settings log check');

export const appSettings = {
  id: 'app-settings',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/app-settings',
  title: 'Application Settings',
  transKey: 'appSettings',
  Icon: LuSettings2,
  permission: PERMISSIONS.COUNTRIES.LIST
};
