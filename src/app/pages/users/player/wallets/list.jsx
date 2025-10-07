import { useParams } from 'react-router';
import PlayerWallets from 'components/sections/player-management/wallets/list';

export default function PlayerWalletsTab() {
  const { playerId } = useParams();

  return <PlayerWallets playerId={playerId} />;
}
