import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';
import { platform } from './platoform';
import { country } from './country';
import { reports } from './report';
// import { payment } from './payment';
import { playerKyc } from './player-kyc';
import { casinoManagement } from './casino-management';
// import { affliate } from './affiliates';
import { segmentation } from './segmentation';
import { emailTemplate } from './email-template';
import { peomocode } from './promocode';
import { roles } from './roles';
import { auditlogs } from './auditlogs';
import { pages } from './pages';
import { crm } from './crm';
import { frontend } from './front-end';
// import { getAiChatBot } from './ai-chat';`
import { banner } from './banner';
import { tenants } from './tenant';

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
    country,
    banner,
    pages,
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
    crm
  ]
});
