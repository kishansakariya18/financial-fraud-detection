// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import { HomeIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { TbUsersPlus } from 'react-icons/tb';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';
import { HiOutlineCash, HiOutlineSpeakerphone } from 'react-icons/hi';
import { GrSettingsOption } from 'react-icons/gr';
import { CiViewList } from 'react-icons/ci';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { affiliateId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/affiliates/users/${affiliateId}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.AFFILIATES.LIST
    },
    {
      id: randomId(),
      title: t('campaign') + ' ' + t('list'),
      path: `/affiliates/users/${affiliateId}/tab/campaigns`,
      icon: HiOutlineSpeakerphone,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('referred_users'),
      path: `/affiliates/users/${affiliateId}/tab/referred_users`,
      icon: TbUsersPlus,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('withdrawals') + ' ' + t('list'),
      path: `/affiliates/users/${affiliateId}/tab/withdrawals`,
      icon: CiViewList,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('commission') + ' ' + t('setting'),
      path: `/affiliates/users/${affiliateId}/tab/commission-settings`,
      icon: GrSettingsOption,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('commission'),
      path: `/affiliates/users/${affiliateId}/tab/commission`,
      icon: HiOutlineCash,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('transactions'),
      path: `/affiliates/users/${affiliateId}/tab/transactions`,
      icon: ListBulletIcon,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    }
  ];

  return <TabsPage tabs={tabs} />;
}
