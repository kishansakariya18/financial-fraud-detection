// Local Imports
import { useParams } from 'react-router';
import { HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { PERMISSIONS } from 'constants/app.constant';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { campaignUID } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/campaign/${campaignUID}/tab/details`,
      icon: HomeIcon,
      index: 0,
      permission: PERMISSIONS.CAMPAIGN.VIEW
    },
    {
      id: randomId(),
      title: t('logs'),
      path: `/campaign/${campaignUID}/tab/logs`,
      icon: DocumentTextIcon,
      index: 1,
      permission: PERMISSIONS.CAMPAIGN.VIEW
    }
  ];

  return <TabsPage tabs={tabs} />;
}
