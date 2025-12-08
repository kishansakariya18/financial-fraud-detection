import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';
import { platform } from './platoform';
import { reports } from './report';
// import { playerKyc } from './player-kyc';
import { casinoManagement } from './casino-management';
import { segmentation } from './segmentation';
import { emailTemplate } from './event-template';
// import { peomocode } from './promocode';
import { roles } from './roles';
import { auditlogs } from './auditlogs';
import { crm } from './crm';
import { frontend } from './front-end';
// import { tenants } from './tenant';
import { contentManagement } from './content-management';
import { siteConfiguration } from './site-configuration';
import { bonusManagement } from './bonus-management';
import { userClass } from './user-class';
import { responsibleGambling } from './responsible-gambling';
import { enquires } from './enquires';
import { blacklist } from './blacklist';
import { bank } from './bank';
import { userManualWithdrawTransaction } from './user-manual-withdraw-transaction';
// import { userManualDepositTransaction } from './user-manual-deposit-transaction';
// import { registrationFields } from './registration-fields';
import { releaseNotes } from './release-notes';
import { toolsNavigation } from './tools';
import { supervisor } from './supervisor';
import { b2bAgent } from './b2b-agent';
import { bonusCampaign } from './bonus-campaign';
import { faq } from './faq';
import { affiliatesNew } from './affiliates-new';
import { kyc } from './kyc';
// import { globalCommissionSetting } from './global-commission-setting';
import { campaign } from './campaign';

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
    supervisor,
    affiliatesNew,
    // globalCommissionSetting,
    b2bAgent,
    platform,
    contentManagement,
    siteConfiguration,
    bonusManagement,
    frontend,
    reports,
    // tenants,
    kyc,
    // playerKyc,
    casinoManagement,
    segmentation,
    ...emailTemplate,
    // peomocode,
    bonusCampaign,
    auditlogs,
    crm,
    userClass,
    responsibleGambling,
    enquires,
    blacklist,
    bank,
    userManualWithdrawTransaction,
    // registrationFields,
    // userManualDepositTransaction,
    releaseNotes,
    toolsNavigation,
    faq,
    campaign
  ]
});
