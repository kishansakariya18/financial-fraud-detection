import PlayerWallets from 'components/sections/player-management/wallets/list';
import { useParams } from 'react-router';
export default function AgentPlayerWallets() {
  const { playerUID } = useParams();
  return <PlayerWallets isAgent={true} playerId={playerUID} />;
}
