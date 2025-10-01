// Import Dependencies
import { GrSettingsOption } from 'react-icons/gr';

// Local Imports
import { NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const globalCommissionSetting = {
  id: 'commission-setting',
  type: NAV_TYPE_ITEM,
  path: '/commission-setting',
  title: 'Commission Setting',
  transKey: 'nav.commission-setting',
  Icon: GrSettingsOption,
  permission: PERMISSIONS.COMMISSION_SETTING.UPDATE
};
