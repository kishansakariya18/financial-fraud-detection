import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import { NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';
import { platform } from './platoform';
import { country } from './country';
import { reports } from './report';
import { payment } from './payment';
import { playerKyc } from './player-kyc';
import { casinoManagement } from './casino-management';
import { affliate } from './affiliates';
import { segmentation } from './segmentation';
import { roles } from './roles';

export const dashboards = {
  id: 'dashboards',
  type: NAV_TYPE_ROOT,
  path: '/',
  title: 'Dashboards',
  transKey: 'nav.dashboards.dashboards',
  Icon: DashboardsIcon,
  childs: [
    users,
    platform,
    country,
    payment,
    roles,
    reports,
    playerKyc,
    casinoManagement,
    affliate,
    segmentation
  ]
};
