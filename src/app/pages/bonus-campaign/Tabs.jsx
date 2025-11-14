// Local Imports
import { useParams } from 'react-router';
// import TabNavigation from "./ShiftLeftAnimation";
import { HomeIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';
import { BiHistory } from 'react-icons/bi';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { bonusCampaignId } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/bonus-campaign/${bonusCampaignId}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.BONUS_CAMPAIGN.VIEW
    },
    {
      id: randomId(),
      title: t('bonusGrants'),
      path: `/bonus-campaign/${bonusCampaignId}/tab/history`,
      icon: BiHistory,
      index: 0,
      permission: PERMISSIONS.BONUS_CAMPAIGN.VIEW_GRANTS
    }
  ];

  return <TabsPage tabs={tabs} />;
}
