// Import Dependencies
import { LuLock } from 'react-icons/lu';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const passwordManager = {
  id: 'password-manager',
  type: NAV_TYPE_ITEM,
  path: '/site-configuration/password-manager',
  title: 'Password Manager',
  transKey: 'passwordManager',
  Icon: LuLock,
  permission: PERMISSIONS.APP_SETTING.EDIT
};
