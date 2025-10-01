// // Local Imports
// import { useParams } from 'react-router';
// import { HomeIcon } from '@heroicons/react/24/outline';
// import { randomId } from 'utils/randomId';
// import { useTranslation } from 'react-i18next';
// import TabsPage from 'components/custom/TabsPage';

// // ----------------------------------------------------------------------

// export default function PlayerDetailTabs() {
//   const { playerUID } = useParams();
//   const { t } = useTranslation();

//   const tabs = [
//     {
//       id: randomId(),
//       title: t('details'),
//       path: `/players/${playerUID}/tab/details`,
//       icon: HomeIcon,
//       index: 0
//     }
//     // More tabs can be added in the future here
//     // {
//     //   id: randomId(),
//     //   title: t('transactions'),
//     //   path: `/players/${playerUID}/tab/transactions`,
//     //   icon: ListBulletIcon,
//     //   index: 1
//     // }
//   ];

import { useParams } from 'react-router';
import { HomeIcon, ListBulletIcon, WalletIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';

// ----------------------------------------------------------------------

export default function AgentPlayerDetailTabs() {
  const { playerUID } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/players/${playerUID}/tab/details`,
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
      path: `/players/${playerUID}/tab/transactions`,
      icon: ListBulletIcon,
      index: 2
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/players/${playerUID}/tab/login-history`,
      icon: ListBulletIcon,
      index: 3
    },
    // {
    //   id: randomId(),
    //   title: t('notes'),
    //   path: `/players/${playerUID}/tab/player-notes`,
    //   icon: ListBulletIcon,
    //   index: 4
    // },
    // {
    //   id: randomId(),
    //   title: t('referral'),
    //   path: `/players/${playerUID}/tab/referrals`,
    //   icon: UserGroupIcon,
    //   index: 5
    // },
    {
      id: randomId(),
      title: t('wallets'),
      path: `/players/${playerUID}/tab/wallets`,
      icon: WalletIcon,
      index: 6
    }
  ];

  return <TabsPage tabs={tabs} />;
}
