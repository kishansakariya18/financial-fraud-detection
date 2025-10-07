import AgentWallet from 'components/sections/b2b-agents/view/AgentWallet';
import { useSelector } from 'react-redux';

export default function AgentTransaction() {
  const userData = useSelector((state) => state.auth.userData);

  return <AgentWallet agentUID={userData?.AgentUID} breadcrumbs={null} />;
}
