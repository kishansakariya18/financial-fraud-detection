import { useParams } from 'react-router';
import { HomeIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import AdminTabsPage from 'components/sections/admins/AdminTabsPage';

export default function Tabs() {
  const { supervisorUID } = useParams();

  const tabsConfig = [
    {
      titleKey: 'details',
      path: 'details',
      icon: HomeIcon
    },
    {
      titleKey: 'calling_agents',
      path: 'calling-agents',
      icon: UserGroupIcon
    },
    {
      titleKeys: ['login', 'history'],
      path: 'login-history',
      icon: ClockIcon
    }
  ];

  return (
    <AdminTabsPage userUID={supervisorUID} basePath="/users/supervisor" tabsConfig={tabsConfig} />
  );
}
