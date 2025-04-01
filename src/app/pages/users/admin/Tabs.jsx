import { useParams } from 'react-router';
import { HomeIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';

// ----------------------------------------------------------------------

export default function Tabs() {
  const { adminId } = useParams();
  const { t } = useTranslation();
  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/admin/${adminId}/tab/details`,
      icon: HomeIcon
    }
  ];

  return <TabsPage tabs={tabs} />;
}
