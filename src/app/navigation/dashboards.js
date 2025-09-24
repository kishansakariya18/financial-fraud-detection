import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';
import { platform } from './platoform';
import { reports } from './report';
import { playerKyc } from './player-kyc';
import { casinoManagement } from './casino-management';
import { segmentation } from './segmentation';
import { emailTemplate } from './event-template';
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
import { responsibleGambling } from './responsible-gambling';
import { blacklist } from './blacklist';
import { bank } from './bank';
import { userManualDepositTransaction } from './user-manual-deposit-transaction';
import { registrationFields } from './registration-fields';
import { releaseNotes } from './release-notes';
import { supervisor } from './supervisor';
import { affiliatesNew } from './affiliates-new';

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
    affiliatesNew,
    supervisor,
    platform,
    contentManagement,
    siteConfiguration,
    bonusManagement,
    frontend,
    reports,
    tenants,
    playerKyc,
    casinoManagement,
    segmentation,
    ...emailTemplate,
    peomocode,
    auditlogs,
    crm,
    paymentProvider,
    userClass,
    responsibleGambling,
    blacklist,
    bank,
    registrationFields,
    userManualDepositTransaction,
    releaseNotes
  ]
});
