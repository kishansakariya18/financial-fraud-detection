// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import {
  AdjustmentsVerticalIcon,
  HomeIcon,
  ListBulletIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { playerId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/player/${playerId}/tab/details`,
      icon: HomeIcon,
      index: 0
    },
    {
      id: randomId(),
      title: t('limits'),
      path: `/player/${playerId}/tab/limits`,
      icon: AdjustmentsVerticalIcon,
      index: 1
    },
    {
      id: randomId(),
      title: t('transactions'),
      path: `/player/${playerId}/tab/transactions`,
      icon: ListBulletIcon,
      index: 2
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/player/${playerId}/tab/login-history`,
      icon: ListBulletIcon,
      index: 3
    },
    {
      id: randomId(),
      title: t('manage') + ' ' + t('fund'),
      path: `/player/${playerId}/tab/manage-fund`,
      icon: WalletIcon,
      index: 4
    },
    {
      id: randomId(),
      title: t('notes'),
      path: `/player/${playerId}/tab/player-notes`,
      icon: ListBulletIcon,
      index: 5
    }
  ];

  return <TabsPage tabs={tabs} />;
}
