import LoginHistory from 'components/sections/login-history/LoginHistory';

export default function AgentLoginHistoryList() {
  return (
    <LoginHistory
      paramKey="agentUID"
      breadcrumbConfig={{ title: 'calling_agents', path: '/calling-agents/list' }}
    />
  );
}
