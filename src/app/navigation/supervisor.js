import { UserGroupIcon } from '@heroicons/react/24/outline';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';

import {
  NAV_TYPE_COLLAPSE,
  NAV_TYPE_ITEM,
  PERMISSIONS,
  PLATFORM_TYPE
} from 'constants/app.constant';

export const supervisor = {
  id: 'supervisor.supervisor',
  type: NAV_TYPE_COLLAPSE,
  path: '/calling-agents',
  title: 'Calling Agents',
  transKey: 'nav.users.calling_agents',
  Icon: UserGroupIcon,
  permission: [PERMISSIONS.CALLING_AGENT.LIST],
  platformType: [PLATFORM_TYPE.B2C],
  childs: [
    {
      id: 'calling-agents.dashboard',
      path: '/calling-agents/supervisor-dashboard',
      type: NAV_TYPE_ITEM,
      title: 'Calling Agents',
      transKey: 'nav.dashboards.dashboard',
      Icon: MonitorIcon,
      permission: PERMISSIONS.CALLING_AGENT.LIST,
      platformType: [PLATFORM_TYPE.B2C]
    },
    {
      id: 'calling-agents.list',
      path: '/calling-agents/list',
      type: NAV_TYPE_ITEM,
      title: 'Calling Agents',
      transKey: 'nav.users.calling_agents',
      Icon: UserGroupIcon,
      permission: PERMISSIONS.CALLING_AGENT.LIST,
      platformType: [PLATFORM_TYPE.B2C]
    }
  ]
};
