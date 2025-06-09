// Import Dependencies
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, PERMISSIONS } from 'constants/app.constant';
import { country } from './country';

export const siteConfiguration = {
  id: 'site_configuration',
  type: NAV_TYPE_COLLAPSE,
  path: '/site_configuration',
  title: 'Site Configuration',
  transKey: 'site_configuration',
  Icon: Cog6ToothIcon,
  permission: [PERMISSIONS.COUNTRIES.LIST],
  childs: [country]
};
