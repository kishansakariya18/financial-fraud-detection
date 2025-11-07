import { useTranslation } from 'react-i18next';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Page } from 'components/shared/Page';
import {
  AgentDashboardCards,
  LastAgentsTable,
  LastPlayersTable
} from 'components/sections/b2b-agents/dashboard';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';
import PlayerService from 'services/player.services';
import { responseMapper as agentResponseMapper } from 'components/sections/b2b-agents/helper';
import { responseMapper as playerResponseMapper } from 'components/sections/player-management/helper';
import { useSelector } from 'react-redux';
import { AGENT_TIER_TYPE } from 'constants/app.constant';
import { useMemo } from 'react';

const AgentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageTitle = t('agent_dashboard');
  const { userData } = useSelector((state) => state.auth);
  const isType3Agent = useMemo(
    () => userData?.AgentType === AGENT_TIER_TYPE.TIER_3,
    [userData?.AgentType]
  );

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalActiveAgents: 0,
    totalInactiveAgents: 0,
    totalActivePlayers: 0,
    totalInactivePlayers: 0,
    directAgents: 0,
    grandchildAgents: 0,
    lastAgents: [],
    lastPlayers: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const agentCountsResult = await B2BAgentService.getChildAgentDashboardCounts()
        .then((res) => res.response.data)
        .catch((err) => {
          console.log('err: ', err);
        });

      const playerCountsResult = await PlayerService.getPlayerDashboardCounts()
        .then((res) => res.response.data)
        .catch((err) => {
          console.log('err: ', err);
        });

      let agentsResult = [];
      if (!isType3Agent) {
        agentsResult = await B2BAgentService.getAllChildAgent({
          pagination: { pageIndex: 0, pageSize: 10 },
          filters: {}
        })
          .then((res) => {
            console.log('res: ', res.response);
            return res.response.data;
          })
          .catch((err) => {
            console.log('err: ', err);
          });
      }

      const playersResult = await PlayerService.playerList({
        pagination: { pageIndex: 0, pageSize: 10 },
        filters: {}
      })
        .then((res) => {
          console.log('res: ', res.response);
          return res.response.data;
        })
        .catch((err) => {
          console.log('err: ', err);
        });

      // Process agent counts
      const agentCounts = {
        totalActiveAgents: agentCountsResult?.totalActive || 0,
        totalInactiveAgents: agentCountsResult?.totalInactive || 0,
        directAgents: agentCountsResult?.directActive || 0 + agentCountsResult?.directInactive || 0,
        grandchildAgents:
          agentCountsResult?.grandActive || 0 + agentCountsResult?.grandInactive || 0
      };

      // Process player counts
      const playerCounts = {
        totalActivePlayers: playerCountsResult?.totalActive || 0,
        totalInactivePlayers:
          (playerCountsResult?.totalInactive || 0) + (playerCountsResult?.totalBlocked || 0)
      };

      // Process agents data for last N agents
      const agentsData = agentResponseMapper(agentsResult || []);
      const playersData = playerResponseMapper(playersResult || []);

      setDashboardData({
        ...agentCounts,
        ...playerCounts,
        lastAgents: agentsData.slice(0, 10), // Last 10 agents
        lastPlayers: playersData.slice(0, 10) // Last 10 players
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [isType3Agent]);

  const handleViewAllAgents = () => {
    navigate('/agents');
  };

  const handleViewAllPlayers = () => {
    navigate('/players');
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Page title={pageTitle}>
      <div className="transition-content w-full px-[--margin-x] pt-5 lg:pt-6">
        <div className="min-w-0">
          {/* Dashboard Cards */}
          <div className="mb-6">
            <AgentDashboardCards dashboardData={dashboardData} loading={isLoading} />
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 gap-6">
            {/* Last Agents Table */}

            {!isType3Agent && (
              <div>
                <LastAgentsTable
                  data={dashboardData.lastAgents}
                  loading={isLoading}
                  onViewAgent={handleViewAllAgents}
                />
              </div>
            )}

            {/* Last Players Table */}
            <div>
              <LastPlayersTable
                data={dashboardData.lastPlayers}
                loading={isLoading}
                onViewPlayer={handleViewAllPlayers}
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AgentDashboard;
