import {
  UsersIcon,
  UserCircleIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import MonitorIcon from 'assets/nav-icons/monitor.svg?react';

import { NAV_TYPE_ITEM, NAV_TYPE_ROOT, NAV_TYPE_COLLAPSE } from 'constants/app.constant';

export const b2bAgentNavigationLayout = {
  id: 'b2b-agent-dashboards',
  type: NAV_TYPE_ROOT,
  path: '/',
  title: 'Dashboards',
  transKey: 'nav.dashboards.dashboards',
  Icon: DashboardsIcon,
  childs: [
    {
      id: 'dashboard',
      path: '/agent/dashboard',
      type: NAV_TYPE_ITEM,
      title: 'Dashboard',
      transKey: 'nav.dashboards.dashboard',
      Icon: MonitorIcon
    },
    {
      id: 'b2b_agent_tree',
      path: '/agent/tree-view',
      type: NAV_TYPE_ITEM,
      title: 'Agent Tree',
      transKey: 'nav.b2b_agent.agent_tree',
      Icon: AdjustmentsHorizontalIcon
    },
    {
      id: 'b2b_agents',
      path: '/agents',
      type: NAV_TYPE_ITEM,
      title: 'Agents',
      transKey: 'nav.b2b_agent.agents',
      Icon: UserCircleIcon
    },
    {
      id: 'b2b_agents_players',
      path: '/players',
      type: NAV_TYPE_ITEM,
      title: 'Players',
      transKey: 'nav.b2b_agent.players',
      Icon: UsersIcon
    },
    {
      id: 'b2b_agents_transaction',
      path: '/agent/transaction',
      type: NAV_TYPE_ITEM,
      title: 'Transactions',
      transKey: 'nav.b2b_agent.transactions',
      Icon: BanknotesIcon
    },
    {
      id: 'b2b_agents_withdraws',
      path: '/agent',
      type: NAV_TYPE_COLLAPSE,
      title: 'Withdraw Requests',
      transKey: 'nav.b2b_agent.withdraw_requests',
      Icon: CurrencyDollarIcon,
      childs: [
        {
          id: 'b2b_my_withdrawals',
          path: '/agent/my-requests',
          type: NAV_TYPE_ITEM,
          title: 'My Withdrawals',
          transKey: 'nav.b2b_agent.my_withdrawals',
          Icon: CurrencyDollarIcon
        },
        {
          id: 'b2b_agent_withdrawals',
          path: '/agent/agent-withdrawals',
          type: NAV_TYPE_ITEM,
          title: 'Agent Withdrawals',
          transKey: 'nav.b2b_agent.agent_withdrawals',
          Icon: CurrencyDollarIcon
        },
        {
          id: 'b2b_player_withdrawals',
          path: '/agent/player-requests',
          type: NAV_TYPE_ITEM,
          title: 'Player Withdrawals',
          transKey: 'nav.b2b_agent.player_withdrawals',
          Icon: CurrencyDollarIcon
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
