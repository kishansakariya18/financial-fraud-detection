import { NAV_TYPE_ITEM } from 'constants/app.constant';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const toolsNavigation = {
  id: 'ip_lookup',
  type: NAV_TYPE_ITEM,
  path: '/tools/ip-lookup',
  title: 'IP Lookup',
  transKey: 'ipLookup',
  Icon: MagnifyingGlassIcon,
  permission: []
};

export default toolsNavigation;
