import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';
import { platform } from './platoform';
import { country } from './country';
import { reports } from './report';
import { payment } from './payment';
import { playerKyc } from './player-kyc';
import { casinoManagement } from './casino-management';
import { affliate } from './affiliates';
import { segmentation } from './segmentation';
import { emailTemplate } from './email-template';
import { peomocode } from './promocode';
import { roles } from './roles';
import { auditlogs } from './auditlogs';
import { pages } from './pages';
import { crm } from './crm';
<<<<<<< HEAD
// import { getAiChatBot } from './ai-chat';`
=======
import { getAiChatBot } from './ai-chat';
import { frontend } from './front-end';
>>>>>>> 3be0a52b35679a70ce94e7e4076c6bfadb153c09

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
    users,
    platform,
    country,
    pages,
    frontend,
    payment,
    roles,
    reports,
    playerKyc,
    casinoManagement,
    affliate,
    segmentation,
    emailTemplate,
    peomocode,
    auditlogs,
    crm
  ]
});
