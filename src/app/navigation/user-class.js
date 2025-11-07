// Local Imports
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const userClass = {
  id: 'user-class',
  type: NAV_TYPE_ITEM,
  path: '/user-class',
  title: 'Player Class',
  transKey: 'Player Class',
  Icon: ArchiveBoxArrowDownIcon,
  permission: PERMISSIONS.USER_CLASS.LIST,
  platformType: [PLATFORM_TYPE.B2C]
};
