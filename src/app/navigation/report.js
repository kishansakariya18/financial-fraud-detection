// Import Dependencies
import {
  DocumentChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
  // BanknotesIcon
} from '@heroicons/react/24/outline';

// Local Imports
// import SettingIcon from 'assets/dualicons/setting.svg?react';
import {
  NAV_TYPE_COLLAPSE,
  NAV_TYPE_ITEM,
  PERMISSIONS,
  PLATFORM_TYPE
} from 'constants/app.constant';

export const reports = {
  id: 'report',
  type: NAV_TYPE_COLLAPSE,
  title: 'Report',
  path: '/report',
  transKey: 'report',
  Icon: DocumentChartBarIcon,
  permission: [
    PERMISSIONS.REPORT.BETSLIP_REPORT_VIEW,
    PERMISSIONS.REPORT.DEPOSIT_REPORT_VIEW,
    PERMISSIONS.REPORT.WITHDRAW_REPORT_VIEW
  ],
  childs: [
    {
      id: 'betslip',
      type: NAV_TYPE_ITEM,
      path: '/report/betslip-transctions',
      title: 'betslip',
      transKey: 'betslip_transactions',
      Icon: DocumentTextIcon,
      permission: PERMISSIONS.REPORT.BETSLIP_REPORT_VIEW
    },
    {
      id: 'depositTransaction',
      type: NAV_TYPE_ITEM,
      path: '/report/deposit-transctions',
      title: 'depsositTransaction',
      transKey: 'deposit_transactions',
      Icon: ArrowDownTrayIcon,
      permission: PERMISSIONS.REPORT.DEPOSIT_REPORT_VIEW,
      platformType: [PLATFORM_TYPE.B2C]
    },
    {
      id: 'withdrawTransaction',
      type: NAV_TYPE_ITEM,
      path: '/report/withdraw-transctions',
      title: 'withdrawTransaction',
      transKey: 'withdraw_transactions',
      Icon: ArrowUpTrayIcon,
      permission: PERMISSIONS.REPORT.WITHDRAW_REPORT_VIEW
    }
    // {
    //   id: 'playerBalance',
    //   type: NAV_TYPE_ITEM,
    //   path: '/report/player-balance/list',
    //   title: 'playerBalance',
    //   transKey: 'playerBalance',
    //   Icon: BanknotesIcon,
    //   permission: PERMISSIONS.REPORT.PLAYER_BALANCE_REPORT_VIEW
    // }
    // {
    //   id: 'depositBalance',
    //   type: NAV_TYPE_ITEM,
    //   path: '/report/deposit-balance/list',
    //   title: 'depositBalance',
    //   transKey: 'depositBalance',
    //   Icon: QueueListIcon,
    //   permission: PERMISSIONS.REPORT.PLAYER_BALANCE_REPORT_VIEW
    // }
  ]
};
