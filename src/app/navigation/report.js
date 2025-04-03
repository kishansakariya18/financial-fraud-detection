// Import Dependencies
import { BookOpenIcon, QueueListIcon } from '@heroicons/react/24/outline';

// Local Imports
// import SettingIcon from 'assets/dualicons/setting.svg?react';
import { NAV_TYPE_COLLAPSE, NAV_TYPE_ITEM, PERMISSIONS } from 'constants/app.constant';

export const reports = {
  id: 'report',
  type: NAV_TYPE_COLLAPSE,
  path: '/report',
  title: 'Report',
  transKey: 'report',
  Icon: BookOpenIcon,
  permission: [PERMISSIONS.REPORT.BETSLIP_TRANSACTION_VIEW],
  childs: [
    {
      id: 'betslip',
      type: NAV_TYPE_ITEM,
      path: '/report/betslip-transctions',
      title: 'betslip',
      transKey: 'betslip_transactions',
      Icon: QueueListIcon,
      permission: PERMISSIONS.REPORT.BETSLIP_TRANSACTION_VIEW
    }
  ]
};
