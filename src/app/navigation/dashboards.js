import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM, NAV_TYPE_ROOT } from 'constants/app.constant';
import { users } from './users';

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
    {
      id: 'transactions',
      path: '/transactions',
      type: NAV_TYPE_ITEM,
      title: 'Transactions',
      transKey: 'nav.users.transactions',
      Icon: MonitorIcon
    },
    {
      id: 'categories',
      path: '/dashboards/categories',
      type: NAV_TYPE_ITEM,
      title: 'Categories',
      transKey: 'nav.dashboards.categories',
      Icon: RectangleStackIcon
    },
    users
  ]
});
