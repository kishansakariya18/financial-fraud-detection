import { useParams } from 'react-router';
import { HomeIcon } from '@heroicons/react/24/outline';
import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import { ListBulletIcon } from '@heroicons/react/20/solid';

export default function Tabs() {
  const { adminId } = useParams();
  const { t } = useTranslation();
  const tabs = [
    {
      id: randomId(),
      title: t('details'),
      path: `/users/admin/${adminId}/tab/details`,
      icon: HomeIcon
    },
    {
      id: randomId(),
      title: t('login') + ' ' + t('history'),
      path: `/users/admin/${adminId}/tab/login-history`,
      icon: ListBulletIcon
    }
  ];

  return <TabsPage tabs={tabs} />;
}
