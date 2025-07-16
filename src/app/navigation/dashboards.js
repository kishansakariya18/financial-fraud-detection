import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';
import { platform } from './platoform';
import { reports } from './report';
import { playerKyc } from './player-kyc';
import { casinoManagement } from './casino-management';
import { segmentation } from './segmentation';
import { emailTemplate } from './email-template';
import { peomocode } from './promocode';
import { roles } from './roles';
import { auditlogs } from './auditlogs';
import { crm } from './crm';
import { frontend } from './front-end';
import { tenants } from './tenant';
import { contentManagement } from './content-management';
import { siteConfiguration } from './site-configuration';
import { bonusManagement } from './bonus-management';
import { paymentProvider } from './payment-provider';
import { userClass } from './user-class';
import { blacklist } from './blacklist';

export const dashboards = () => ({
  id: 'dashboards',
  type: NAV_TYPE_ROOT,
  path: '/',
  title: 'Dashboards',
  transKey: 'nav.dashboards.dashboards',
  Icon: DashboardsIcon,
  childs: [
    {
      id: 'dashboard',
      path: '/dashboards/home',
      type: NAV_TYPE_ITEM,
      title: 'Dashboard',
      transKey: 'nav.dashboards.dashboard',
      Icon: MonitorIcon
    },
    roles,
    users,
    platform,
    // country,
    // banner,
    contentManagement,
    siteConfiguration,
    bonusManagement,
    // pages,
    frontend,
    // payment,
    reports,
    tenants,
    playerKyc,
    // affliate,
    casinoManagement,
    segmentation,
    emailTemplate,
    peomocode,
    auditlogs,
    crm,
    paymentProvider,
    userClass,
    blacklist
  ]
});
