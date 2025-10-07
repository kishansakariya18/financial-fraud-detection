import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentWallet from 'components/sections/b2b-agents/view/AgentWallet';

const AdminAgentWallet = () => {
  const { agentUID } = useParams();
  const { t } = useTranslation();

  const breadcrumbConfig = [
    { title: t('agents') || 'Agents', path: '/agent/list' },
    { title: t('wallet') || 'Wallet' }
  ];

  return <AgentWallet agentUID={agentUID} breadcrumbConfig={breadcrumbConfig} />;
};
export default AdminAgentWallet;
