import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import AgentWallet from 'components/sections/b2b-agents/view/AgentWallet';
import usePermissions from 'app/router/usePermissions';
import { PERMISSIONS } from 'constants/app.constant';

const AdminAgentWalletTab = () => {
  const { agentUID } = useParams();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const breadcrumbConfig = [
    { title: t('agents') || 'Agents', path: '/agent/list' },
    { title: t('wallet') || 'Wallet' }
  ];

  return (
    <AgentWallet
      manageCommissionFunds={hasPermission(PERMISSIONS.AGENTS.WALLET_MANAGE)}
      manageLineupFunds={PERMISSIONS.AGENTS.WALLET_MANAGE}
      agentUID={agentUID}
      breadcrumbConfig={breadcrumbConfig}
    />
  );
};
export default AdminAgentWalletTab;
