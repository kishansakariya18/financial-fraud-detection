import PlayerWallets from 'components/sections/player-management/wallets/list';
import { useParams } from 'react-router';
export default function AgentPlayerWallets() {
  const { playerId } = useParams();
  return <PlayerWallets isAgent={true} playerId={playerId} />;
}
