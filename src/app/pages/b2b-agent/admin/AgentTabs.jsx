// Local Imports
import { useParams } from 'react-router';
import {
  HomeIcon,
  ListBulletIcon,
  WalletIcon,
  ChartBarIcon,
  UserCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';

// ----------------------------------------------------------------------

export default function AgentTabs() {
  const { agentUID } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/agent/${agentUID}/tab/details`,
      icon: HomeIcon,
      index: 0
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/agent/${agentUID}/tab/login-history`,
      icon: ListBulletIcon,
      index: 1
    },
    {
      id: randomId(),
      title: t('wallet') + ' ' + t('and') + ' ' + t('transactions'),
      path: `/agent/${agentUID}/tab/wallet`,
      icon: WalletIcon,
      index: 2
    },
    {
      id: randomId(),
      title: t('agents'),
      path: `/agent/${agentUID}/tab/agents`,
      icon: UserCircleIcon,
      index: 3
    },
    {
      id: randomId(),
      title: t('players'),
      path: `/agent/${agentUID}/tab/players`,
      icon: UserGroupIcon,
      index: 4
    },
    {
      id: randomId(),
      title: t('withdraw_requests_for_this_agent'),
      path: `/agent/${agentUID}/tab/withdraw-requests`,
      icon: ChartBarIcon,
      index: 5
    }
  ];

  return <TabsPage tabs={tabs} />;
}
