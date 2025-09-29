import { CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { NAV_TYPE_COLLAPSE, PERMISSIONS } from 'constants/app.constant';

export const b2bAgent = {
  id: 'b2b-agent.b2b-agent',
  type: NAV_TYPE_COLLAPSE,
  path: '/agent',
  title: 'B2B Agents',
  transKey: 'nav.users.b2b_agents',
  Icon: UserGroupIcon,
  permission: [PERMISSIONS.AGENTS.LIST],
  childs: [
    {
      id: 'b2b-agent.b2b-agent-list',
      path: '/agent/list',
      title: 'B2B Agents',
      transKey: 'nav.users.b2b_agents',
      Icon: UserGroupIcon,
      permission: [PERMISSIONS.AGENTS.LIST]
    },
    {
      id: 'b2b-agent.b2b-agent-withdraw-requests',
      path: '/agent/withdraw-requests',
      title: 'Withdraw Requests',
      transKey: 'nav.users.withdraw_requests',
      Icon: CurrencyDollarIcon,
      permission: [PERMISSIONS.AGENTS.LIST]
    }
  ]
};
