// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import { HomeIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { MdOutlineCampaign } from 'react-icons/md';
import { TbUsersPlus } from 'react-icons/tb';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';
import { HiOutlineCash } from 'react-icons/hi';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { affiliateId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/affiliates/${affiliateId}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.AFFILIATES.LIST
    },
    {
      id: randomId(),
      title: t('campaign') + ' ' + t('list'),
      path: `/affiliates/${affiliateId}/tab/campaigns`,
      icon: MdOutlineCampaign,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('referred_users'),
      path: `/affiliates/${affiliateId}/tab/referred_users`,
      icon: TbUsersPlus,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('withdrawals') + ' ' + t('list'),
      path: `/affiliates/${affiliateId}/tab/withdrawals`,
      icon: ListBulletIcon,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    },
    {
      id: randomId(),
      title: t('commission'),
      path: `/affiliates/${affiliateId}/tab/commission`,
      icon: HiOutlineCash,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    }
  ];

  return <TabsPage tabs={tabs} />;
}
