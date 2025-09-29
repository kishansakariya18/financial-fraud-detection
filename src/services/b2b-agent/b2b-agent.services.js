import { parseAgentStatusToApi, parseAgentTypeToApi } from 'components/sections/b2b-agents/helper';
import apiConfig from '../../configs/api.config';
import moment from 'moment';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import apiInstance from 'utils/apiInstance';

const B2BAgentService = {
  getAllAgent: async (data) => {
    const { pagination, filters } = data;

    const apiRequestParams = {
      keyword: filters.keyword || undefined,
      status: filters.status ? parseAgentStatusToApi(filters.status) : undefined,
      agentType: filters.agentType ? parseAgentTypeToApi(filters.agentType) : undefined,
      startDate: filters.startDate
        ? moment(Number(filters.startDate)).startOf('day').toDate()
        : undefined,
      endDate: filters.endDate ? moment(Number(filters.endDate)).endOf('day').toDate() : undefined,
      perPage: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
      page: pagination.pageIndex + 1
    };

    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.LIST, apiRequestParams);
  },

  createAgent: async (agentData) => {
    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.CREATE, agentData);
  },

  editAgent: async (agentUID, agentData) => {
    return apiInstance.patch(apiConfig.endPoints.B2B_AGENT.EDIT(agentUID), agentData);
  },

  changeAgentStatus: async (agentUID) => {
    return apiInstance.patch(apiConfig.endPoints.B2B_AGENT.CHANGE_STATUS(agentUID));
  },

  getAgentDetails: async (agentUID) => {
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.DETAIL(agentUID));
  },

  getAllChildAgent: async (data) => {
    const { pagination, filters, agentUID } = data;

    const apiRequestParams = {
      keyword: filters.keyword || undefined,
      status: filters.status ? parseAgentStatusToApi(filters.status) : undefined,
      startDate: filters.startDate
        ? moment(Number(filters.startDate)).startOf('day').toDate()
        : undefined,
      endDate: filters.endDate ? moment(Number(filters.endDate)).endOf('day').toDate() : undefined,
      perPage: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
      page: pagination.pageIndex + 1,
      ...(agentUID && { agentUID })
    };

    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.CHILD_AGENT_LIST, apiRequestParams);
  },

  createChildAgent: async (agentData) => {
    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.CHILD_AGENT_CREATE, agentData);
  },

  editChildAgent: async (agentUID, agentData) => {
    return apiInstance.patch(apiConfig.endPoints.B2B_AGENT.CHILD_AGENT_EDIT(agentUID), agentData);
  },

  changeChildAgentStatus: async (agentUID) => {
    return apiInstance.patch(apiConfig.endPoints.B2B_AGENT.CHILD_AGENT_CHANGE_STATUS(agentUID));
  },

  getChildAgentDetails: async (agentUID) => {
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.CHILD_AGENT_DETAIL(agentUID));
  },

  createPlayer: async (playerData) => {
    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.PLAYER_CREATE, playerData);
  },

  changePlayerStatus: async (playerUID) => {
    return apiInstance.patch(apiConfig.endPoints.B2B_AGENT.PLAYER_CHANGE_STATUS(playerUID));
  },

  getPlayerDetails: async (playerUID) => {
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.PLAYER_DETAIL(playerUID));
  },

  getAgentLoginHistory: async (data) => {
    const { pagination, agentUID } = data;
    const params = {
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize
    };
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.AGENT_LOGIN_HISTORY(agentUID), { params });
  },

  getChildAgentDashboardCounts: async () => {
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.CHILD_AGENT_DASHBOARD_COUNTS);
  }
};

export default B2BAgentService;
