import {
  UsersIcon,
  UserCircleIcon,
  BanknotesIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownOnSquareIcon
} from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';

import {
  NAV_TYPE_ITEM,
  NAV_TYPE_ROOT,
  NAV_TYPE_COLLAPSE,
  PLATFORM_TYPE
} from 'constants/app.constant';

export const b2bAgentNavigationLayout = {
  id: 'b2b-agent-dashboards',
  type: NAV_TYPE_ROOT,
  path: '/',
  title: 'Dashboards',
  transKey: 'nav.dashboards.dashboards',
  Icon: DashboardsIcon,
  platformType: PLATFORM_TYPE.B2B, // Only show in B2B platform
  childs: [
    {
      id: 'dashboard',
      path: '/agent/dashboard',
      type: NAV_TYPE_ITEM,
      title: 'Dashboard',
      transKey: 'nav.dashboards.dashboard',
      Icon: MonitorIcon,
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b_agent_tree',
      path: '/agent/tree-view',
      type: NAV_TYPE_ITEM,
      title: 'Agent Tree',
      transKey: 'nav.b2b_agent.agent_tree',
      Icon: AdjustmentsHorizontalIcon,
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b_agents',
      path: '/agents',
      type: NAV_TYPE_ITEM,
      title: 'Agents',
      transKey: 'nav.b2b_agent.agents',
      Icon: UserCircleIcon,
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b_agents_players',
      path: '/players',
      type: NAV_TYPE_ITEM,
      title: 'Players',
      transKey: 'nav.b2b_agent.players',
      Icon: UsersIcon,
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b_agents_transaction',
      path: '/agent/transaction',
      type: NAV_TYPE_ITEM,
      title: 'Transactions',
      transKey: 'nav.b2b_agent.transactions',
      Icon: BanknotesIcon,
      platformType: PLATFORM_TYPE.B2B
    },
    {
      id: 'b2b_agents_withdraws',
      path: '/agent',
      type: NAV_TYPE_COLLAPSE,
      title: 'Withdraw Requests',
      transKey: 'nav.b2b_agent.withdraw_requests',
      Icon: ArrowDownOnSquareIcon,
      platformType: PLATFORM_TYPE.B2B,
      childs: [
        {
          id: 'b2b_my_withdrawals',
          path: '/agent/my-requests',
          type: NAV_TYPE_ITEM,
          title: 'My Withdrawals',
          transKey: 'nav.b2b_agent.my_withdrawals',
          Icon: ArrowDownOnSquareIcon,
          platformType: PLATFORM_TYPE.B2B
        },
        {
          id: 'b2b_agent_withdrawals',
          path: '/agent/agent-withdrawals',
          type: NAV_TYPE_ITEM,
          title: 'Agent Withdrawals',
          transKey: 'nav.b2b_agent.agent_withdrawals',
          Icon: ArrowDownOnSquareIcon,
          platformType: PLATFORM_TYPE.B2B
        },
        {
          id: 'b2b_player_withdrawals',
          path: '/agent/player-requests',
          type: NAV_TYPE_ITEM,
          title: 'Player Withdrawals',
          transKey: 'nav.b2b_agent.player_withdrawals',
          Icon: ArrowDownOnSquareIcon,
          platformType: PLATFORM_TYPE.B2B
        }
      ]
    }
    // {
    //   id: 'b2b_my_withdrawals',
    //   path: '/agent/my-requests',
    //   type: NAV_TYPE_ITEM,
    //   title: 'My Withdrawals',
    //   transKey: 'nav.b2b_agent.my_withdrawals',
    //   Icon: CurrencyDollarIcon
    // },
    // {
    //   id: 'b2b_agent_withdrawals',
    //   path: '/agent/agent-withdrawals',
    //   type: NAV_TYPE_ITEM,
    //   title: 'Agent Withdrawals',
    //   transKey: 'nav.b2b_agent.agent_withdrawals',
    //   Icon: CurrencyDollarIcon
    // },
    // {
    //   id: 'b2b_player_withdrawals',
    //   path: '/agent/player-requests',
    //   type: NAV_TYPE_ITEM,
    //   title: 'Player Withdrawals',
    //   transKey: 'nav.b2b_agent.player_withdrawals',
    //   Icon: CurrencyDollarIcon
    // }
  ]
};
