import LoginHistory from 'components/sections/login-history/LoginHistory';

export default function AdminLoginHistoryList() {
  return (
    <LoginHistory paramKey="adminId" breadcrumbConfig={{ title: 'admin', path: '/users/admin' }} />
  );
}
