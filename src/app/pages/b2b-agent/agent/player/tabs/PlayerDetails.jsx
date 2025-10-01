import { useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ViewDetails } from 'components/sections/player-management/ViewDetails';

const PlayerDetails = () => {
  const { t } = useTranslation();
  const { playerUID } = useParams();
  const [searchParams] = useSearchParams();
  const parentAgent = searchParams.get('parentAgent');

  // Create breadcrumbs based on whether we have parent agent context
  const customBreadcrumbs = parentAgent
    ? [
        { title: t('agents'), path: '/agents' },
        { title: t('players'), path: `/agents/${parentAgent}/tab/players` },
        { title: t('details') }
      ]
    : [{ title: t('players'), path: '/players' }, { title: t('details') }];

  return (
    <ViewDetails
      isAgent={true}
      playerId={playerUID}
      customBreadcrumbs={customBreadcrumbs}
      agentUID={parentAgent}
    />
  );
};

export default PlayerDetails;
