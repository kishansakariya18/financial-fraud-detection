import { useParams } from 'react-router';
import {
  HomeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AdminTabsPage from 'components/sections/admins/AdminTabsPage';

export default function Tabs() {
  const { agentUID } = useParams();

  const tabsConfig = [
    {
      titleKey: 'details',
      path: 'details',
      icon: HomeIcon
    },
    {
      titleKeys: ['login', 'history'],
      path: 'login-history',
      icon: ClockIcon
    },
    {
      titleKeys: ['assigned', 'players'],
      path: 'assigned-players',
      icon: UserIcon
    },
    {
      titleKey: 'target_management',
      path: 'target-management',
      icon: ChartBarIcon
    },
    {
      titleKey: 'commission_summary',
      path: 'commission-summary',
      icon: ChartBarIcon
    },
    {
      titleKey: 'commission_redeem_requests',
      path: 'redeem-requests',
      icon: CurrencyDollarIcon
    }
  ];

  return (
    <AdminTabsPage userUID={agentUID} basePath="/calling-agents/list" tabsConfig={tabsConfig} />
  );
}
