import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Local Imports - UI, Services, Helpers, Utils
import { Page } from 'components/shared/Page';
import CreditAmountDialog from 'components/sections/player-management/CreditAmountDialog';

import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import B2BAgentWalletService from 'services/b2b-agent/b2b-agent-wallet.service';
import PlayerList from 'components/sections/player-management/player-list/PlayerList';
import PlayerService from 'services/player.services';
import { useSelector } from 'react-redux';
import { CustomModal } from 'components/custom/CustomModal';

const AgentPlayerList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageTitle = t('players');
  const userData = useSelector((state) => state.auth.userData);
  const [creditDialog, setCreditDialog] = useState({
    isOpen: false,
    playerData: null,
    loading: false
  });

  const fetchPlayers = (requestObject) => {
    return PlayerService.playerList(requestObject)
      .then(({ status, response }) => {
        if (status === 200) {
          return { data: response.data, status: 'success' };
        }
        return { error: response.error, status: 'error' };
      })
      .catch((error) => {
        return { error: error, status: 'error' };
      });
  };

  const handleCreatePlayer = () => {
    navigate('/players/create');
  };

  const handleViewPlayer = (player) => {
    navigate(`/players/${player.userUID}/tab/details`);
  };

  const handleChangePlayerStatus = async (player) => {
    return await B2BAgentService.changePlayerStatus(player.userUID);
  };

  const handleCreditAmount = (player) => {
    setCreditDialog({
      isOpen: true,
      playerData: player,
      loading: false
    });
  };

  const handleConfirmCredit = async (data) => {
    setCreditDialog((prev) => ({ ...prev, loading: true }));
    await B2BAgentWalletService.agentAddCreditAgentPlayer({
      agentUID: userData?.AgentUID,
      userUID: data.playerUID,
      amount: data.amount
    })
      .then(({ response }) => {
        toast.success(response.message);
        setCreditDialog({ isOpen: false, playerData: null, loading: false });
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setCreditDialog((prev) => ({ ...prev, loading: false }));
      });
  };

  return (
    <>
      <Page title={pageTitle}>
        <PlayerList
          pageTitle={pageTitle}
          onView={handleViewPlayer}
          onChangeStatus={handleChangePlayerStatus}
          onCreditAmount={handleCreditAmount}
          listFor="agent"
          getPlayerList={fetchPlayers}
          countries={null}
          segmentations={null}
          playerClasses={null}
          onCreate={handleCreatePlayer}
          summary={null}
          onFetchSummary={null}
        />
      </Page>

      <CustomModal
        show={!!creditDialog.isOpen}
        onClose={() => setCreditDialog({ isOpen: false, playerData: null, loading: false })}
        title={t('credit_amount')}>
        <CreditAmountDialog
          onClose={() => setCreditDialog({ isOpen: false, playerData: null, loading: false })}
          onConfirm={handleConfirmCredit}
          playerData={creditDialog.playerData}
          loading={creditDialog.loading}
        />
      </CustomModal>
    </>
  );
};

export default AgentPlayerList;
