import LoginHistory from 'components/sections/login-history/LoginHistory';

export default function SupervisorLoginHistoryList() {
  return (
    <LoginHistory
      paramKey="supervisorUID"
      breadcrumbConfig={{ title: 'supervisors', path: '/users/supervisor' }}
    />
  );
}
