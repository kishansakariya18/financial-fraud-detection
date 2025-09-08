// Local Imports
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const responsibleGambling = {
  id: 'responsible-gambling',
  type: NAV_TYPE_ITEM,
  path: '/responsible-gambling',
  title: 'Responsible Gambling',
  transKey: 'responsible_gambling',
  Icon: ShieldCheckIcon,
  permission: PERMISSIONS.RESPONSIBLE_GAMBLING.LIST
};
