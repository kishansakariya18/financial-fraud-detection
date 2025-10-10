// Local Imports
import { useParams } from 'react-router';
import {
  HomeIcon,
  ListBulletIcon,
  WalletIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserCircleIcon
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
      path: `/agents/${agentUID}/tab/details`,
      icon: HomeIcon,
      index: 0
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/agents/${agentUID}/tab/login-history`,
      icon: ListBulletIcon,
      index: 1
    },
    {
      id: randomId(),
      title: t('wallet') + ' ' + t('and') + ' ' + t('transactions'),
      path: `/agents/${agentUID}/tab/wallet`,
      icon: WalletIcon,
      index: 2
    },
    {
      id: randomId(),
      title: t('agents'),
      path: `/agents/${agentUID}/tab/agents`,
      icon: UserCircleIcon,
      index: 3
    },
    {
      id: randomId(),
      title: t('players'),
      path: `/agents/${agentUID}/tab/players`,
      icon: UserGroupIcon,
      index: 4
    },
    {
      id: randomId(),
      title: t('withdraw_requests_for_this_agent'),
      path: `/agents/${agentUID}/tab/withdraw-requests`,
      icon: ChartBarIcon,
      index: 5
    }
  ];

  return <TabsPage tabs={tabs} />;
}
