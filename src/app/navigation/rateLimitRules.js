// Import Dependencies
import { ClockIcon } from '@heroicons/react/24/outline';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const RateLimitRules = {
  id: 'rate_limit_rules',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/rate-limit-rules',
  title: 'Rate Limit Rules',
  transKey: 'rate_limit_rules',
  Icon: ClockIcon,
  permission: PERMISSIONS.RATE_LIMIT_RULES.LIST
};
