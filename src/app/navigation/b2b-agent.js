import {
  AdjustmentsHorizontalIcon,
  BanknotesIcon,
  UserGroupIcon,
  ArrowDownOnSquareIcon
} from '@heroicons/react/24/outline';

import { NAV_TYPE_COLLAPSE, PERMISSIONS, PLATFORM_TYPE } from 'constants/app.constant';

export const b2bAgent = {
  id: 'b2b-agent.b2b-agent',
  type: NAV_TYPE_COLLAPSE,
  path: '/agent',
  title: 'B2B Agents',
  transKey: 'nav.users.b2b_agents',
  Icon: UserGroupIcon,
  permission: [PERMISSIONS.AGENTS.LIST],
  platformType: PLATFORM_TYPE.B2B, // Only show in B2B platform
  childs: [
    {
      id: 'b2b-agent.b2b-agent-operator-transection',
      path: '/agent/transections',
      title: 'Transections',
      transKey: 'nav.b2b_agent.transactions',
      Icon: BanknotesIcon,
      permission: [PERMISSIONS.AGENTS.LIST],
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b-agent.b2b-agent-list',
      path: '/agent/list',
      title: 'B2B Agents',
      transKey: 'nav.users.b2b_agents',
      Icon: UserGroupIcon,
      permission: [PERMISSIONS.AGENTS.LIST],
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b-agent.b2b-agent-tree',
      path: '/agent/tree',
      title: 'Agent Tree',
      transKey: 'nav.b2b_agent.agent_tree',
      Icon: AdjustmentsHorizontalIcon,
      permission: [PERMISSIONS.AGENTS.LIST],
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b-agent.b2b-agent-withdraw-requests',
      path: '/agent/withdraw-requests',
      title: 'Withdraw Requests',
      transKey: 'nav.users.withdraw_requests',
      Icon: ArrowDownOnSquareIcon,
      permission: [PERMISSIONS.AGENTS.LIST],
      platformType: PLATFORM_TYPE.B2B
    }
  ]
};
