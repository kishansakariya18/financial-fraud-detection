import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import { NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';
import { platform } from './platoform';
import { country } from './country';
import { payment } from './payment';
import { playerKyc } from './player-kyc';
import { reports } from './report';
import { affliate } from './affiliates';

export const dashboards = {
  id: 'dashboards',
  type: NAV_TYPE_ROOT,
  path: '/',
  title: 'Dashboards',
  transKey: 'nav.dashboards.dashboards',
  Icon: DashboardsIcon,
  childs: [users, platform, country, payment, reports, playerKyc, affliate]
};
