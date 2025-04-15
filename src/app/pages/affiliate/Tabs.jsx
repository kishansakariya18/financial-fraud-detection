// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import { HomeIcon, ListBulletIcon, WalletIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';
import { FaHistory } from 'react-icons/fa';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { affiliateId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/affiliate/${affiliateId}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.AFFILIATES.LIST
    },
    {
      id: randomId(),
      title: t('player') + ' ' + t('list'),
      path: `/affiliate/${affiliateId}/tab/player-list`,
      icon: ListBulletIcon,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.USER_SIGNUP_LIST
    },
    {
      id: randomId(),
      title: t('transaction') + ' ' + t('list'),
      path: `/affiliate/${affiliateId}/tab/transaction-list`,
      icon: ListBulletIcon,
      index: 2,
      permission: PERMISSIONS.AFFILIATES.TRANSACTIONS
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/affiliate/${affiliateId}/tab/login-history`,
      icon: FaHistory,
      index: 3,
      permission: PERMISSIONS.AFFILIATES.VIEW_LOGIN_HISTORY
    },
    {
      id: randomId(),
      title: t('payout') + ' ' + t('history'),
      path: `/affiliate/${affiliateId}/tab/payout-history`,
      icon: ListBulletIcon,
      index: 4,
      permission: PERMISSIONS.AFFILIATES.PAYOUT
    },
    {
      id: randomId(),
      title: t('manage') + ' ' + t('fund'),
      path: `/affiliate/${affiliateId}/tab/manage-fund`,
      icon: WalletIcon,
      index: 4,
      permission: PERMISSIONS.AFFILIATES.ADD_MONEY
    }
  ];

  return <TabsPage tabs={tabs} />;
}
