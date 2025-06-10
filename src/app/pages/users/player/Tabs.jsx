// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import {
  AdjustmentsVerticalIcon,
  HomeIcon,
  ListBulletIcon,
  UserGroupIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { playerId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/users/player/${playerId}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.USER.LIST
    },
    {
      id: randomId(),
      title: t('limits'),
      path: `/users/player/${playerId}/tab/limits`,
      icon: AdjustmentsVerticalIcon,
      index: 1,
      permission: PERMISSIONS.USER.USER_LEVEL_LIMITS
    },
    {
      id: randomId(),
      title: t('transactions'),
      path: `/users/player/${playerId}/tab/transactions`,
      icon: ListBulletIcon,
      index: 2,
      permission: PERMISSIONS.USER.TRANSACTION_LIST
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/users/player/${playerId}/tab/login-history`,
      icon: ListBulletIcon,
      index: 3,
      permission: PERMISSIONS.USER.VIEW_LOGIN_HISTORY
    },
    {
      id: randomId(),
      title: t('manage') + ' ' + t('fund'),
      path: `/users/player/${playerId}/tab/manage-fund`,
      icon: WalletIcon,
      index: 4,
      permission: PERMISSIONS.USER.ADD_MONEY
    },
    {
      id: randomId(),
      title: t('notes'),
      path: `/users/player/${playerId}/tab/player-notes`,
      icon: ListBulletIcon,
      index: 5,
      permission: PERMISSIONS.USER.COMMENT_VIEW
    },
    {
      id: randomId(),
      title: t('referrals'),
      path: `/users/player/${playerId}/tab/referrals`,
      icon: UserGroupIcon,
      index: 0,
      permission: PERMISSIONS.USER.LIST
    }
  ];

  return <TabsPage tabs={tabs} />;
}
