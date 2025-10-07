import { ChartBarIcon, UsersIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';

import { NAV_TYPE_ITEM, NAV_TYPE_ROOT, PLATFORM_TYPE } from 'constants/app.constant';

export const agentNavigation = {
  id: 'agent-dashboards',
  type: NAV_TYPE_ROOT,
  path: '/',
  title: 'Dashboards',
  transKey: 'nav.dashboards.dashboards',
  Icon: DashboardsIcon,
  platformType: PLATFORM_TYPE.B2C,
  childs: [
    {
      id: 'dashboard',
      path: '/calling-agents/dashboard',
      type: NAV_TYPE_ITEM,
      title: 'Dashboard',
      transKey: 'nav.calling_agent.dashboard',
      Icon: MonitorIcon,
      platformType: [PLATFORM_TYPE.B2C]
    },
    {
      id: 'calling_agent.targets',
      path: '/calling-agents/targets',
      type: NAV_TYPE_ITEM,
      title: 'Targets',
      transKey: 'nav.calling_agent.targets',
      Icon: ChartBarIcon,
      platformType: [PLATFORM_TYPE.B2C]
    },
    {
      id: 'agent.assigned-players',
      path: '/calling-agents/assigned-players',
      type: NAV_TYPE_ITEM,
      title: 'Assigned Players',
      transKey: 'nav.calling_agent.assigned_players',
      Icon: UsersIcon,
      platformType: [PLATFORM_TYPE.B2C]
    },
    {
      id: 'agent.summary',
      path: '/calling-agents/summary',
      type: NAV_TYPE_ITEM,
      title: 'Summary',
      transKey: 'nav.calling_agent.summary',
      Icon: DocumentTextIcon,
      platformType: [PLATFORM_TYPE.B2C]
    }
  ]
};
