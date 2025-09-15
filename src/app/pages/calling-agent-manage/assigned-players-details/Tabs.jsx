import { useParams } from 'react-router';
import { HomeIcon, ListBulletIcon, UserGroupIcon, WalletIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';

// ----------------------------------------------------------------------

export default function AgentPlayerDetailTabs() {
  const { playerId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/calling-agents/assigned-players-details/${playerId}/tab/details`,
      icon: HomeIcon,
      index: 0
    },
    // {
    //   id: randomId(),
    //   title: t('limit'),
    //   path: `/calling-agents/assigned-players-details/${playerId}/tab/limit`,
    //   icon: AdjustmentsVerticalIcon,
    //   index: 1
    // },
    {
      id: randomId(),
      title: t('transactions'),
      path: `/calling-agents/assigned-players-details/${playerId}/tab/transactions`,
      icon: ListBulletIcon,
      index: 2
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/calling-agents/assigned-players-details/${playerId}/tab/login-history`,
      icon: ListBulletIcon,
      index: 3
    },
    {
      id: randomId(),
      title: t('notes'),
      path: `/calling-agents/assigned-players-details/${playerId}/tab/player-notes`,
      icon: ListBulletIcon,
      index: 4
    },
    {
      id: randomId(),
      title: t('referral'),
      path: `/calling-agents/assigned-players-details/${playerId}/tab/referrals`,
      icon: UserGroupIcon,
      index: 5
    },
    {
      id: randomId(),
      title: t('wallets'),
      path: `/calling-agents/assigned-players-details/${playerId}/tab/wallets`,
      icon: WalletIcon,
      index: 6
    }
    // {
    //   id: randomId(),
    //   title: t('total_events'),
    //   path: `/calling-agents/assigned-players-details/${playerId}/tab/total-events`,
    //   icon: ChartBarIcon,
    //   index: 7
    // }
  ];

  return <TabsPage tabs={tabs} />;
}
