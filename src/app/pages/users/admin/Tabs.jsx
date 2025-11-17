import { useParams } from 'react-router';
import { HomeIcon } from '@heroicons/react/24/outline';
import { ListBulletIcon } from '@heroicons/react/20/solid';
import AdminTabsPage from 'components/sections/admins/AdminTabsPage';
import { PERMISSIONS } from 'constants/app.constant';

export default function Tabs() {
  const { adminId } = useParams();

  const tabsConfig = [
    {
      titleKey: 'details',
      path: 'details',
      icon: HomeIcon,
      permission: PERMISSIONS.ADMIN.LIST
    },
    {
      titleKeys: ['login', 'history'],
      path: 'login-history',
      icon: ListBulletIcon,
      permission: PERMISSIONS.ADMIN.VIEW_LOGIN_HISTORY
    }
  ];

  return <AdminTabsPage userUID={adminId} basePath="/users/admin" tabsConfig={tabsConfig} />;
}
