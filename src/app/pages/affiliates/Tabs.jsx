// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import { HomeIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';

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
      title: t('campaigns'),
      path: `/affiliates/${affiliateId}/tab/campaigns`,
      icon: HomeIcon,
      index: 1,
      permission: PERMISSIONS.AFFILIATES.CAMPAIGNS_LIST
    }
  ];

  return <TabsPage tabs={tabs} />;
}
