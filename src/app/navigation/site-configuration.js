// Import Dependencies
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_COLLAPSE, PERMISSIONS } from 'constants/app.constant';
import { country } from './country';
import { RateLimitRules } from './rateLimitRules';

export const siteConfiguration = {
  id: 'site_configuration',
  type: NAV_TYPE_COLLAPSE,
  path: '/site-configuration',
  title: 'Site Configuration',
  transKey: 'site_configuration',
  Icon: Cog6ToothIcon,
  permission: [PERMISSIONS.COUNTRIES.LIST, PERMISSIONS.RATE_LIMIT_RULES.LIST],
  childs: [country, RateLimitRules]
};
