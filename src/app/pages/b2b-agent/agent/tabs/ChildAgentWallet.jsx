import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentWallet from 'components/sections/b2b-agents/view/AgentWallet';

const ChildAgentWallet = () => {
  const { agentUID } = useParams();
  const { t } = useTranslation();

  let breadcrumbConfig = [
    { title: t('agents') || 'Agents', path: '/agents' },
    { title: t('wallet') || 'Wallet' }
  ].filter(Boolean);

  return <AgentWallet agentUID={agentUID} breadcrumbs={breadcrumbConfig} />;
};

export default ChildAgentWallet;
