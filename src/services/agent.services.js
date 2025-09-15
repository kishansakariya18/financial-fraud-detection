import { parseAdminStatusToApi } from 'app/pages/users/admin/helper';
import apiConfig from '../configs/api.config';
import { replaceText } from 'utils/custom.utilities';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import apiInstance from 'utils/apiInstance';
import dayjs from 'dayjs';

const AgentService = {
  getDashboard: async (data) => {
    return apiInstance.get(apiConfig.endPoints.AGENT.DASHBOARD, { params: data });
  },
  getAllAgent: async (data) => {
    const { pagination, filters } = data;

    const apiRequestParams = {
      filters: {
        keyword: filters.keyword || undefined,
        status: filters.status ? parseAdminStatusToApi(filters.status) : undefined
      },
      per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
      page: pagination.pageIndex + 1
    };

    return apiInstance.get(apiConfig.endPoints.AGENT.LIST, { params: apiRequestParams });
  },
  getSupervisorAgent: async (supervisorUID, data) => {
    const { pagination, filters } = data;

    const apiRequestParams = {
      keyword: filters.keyword || undefined,
      agentStatus: filters.status ? parseAdminStatusToApi(filters.status) : undefined,
      supervisorUID,
      per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
      page: pagination.pageIndex + 1
    };

    return apiInstance.get(apiConfig.endPoints.SUPERVISOR.AGENT_LIST, { params: apiRequestParams });
  },

  getAgentPlayerList: async (agentUID, data) => {
    const { pagination, filters } = data;
    const apiRequestParams = {
      status: filters.status ? parseAdminStatusToApi(filters.status) : undefined,
      keyword: filters.search || undefined,
      per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
      page: pagination.pageIndex + 1
    };
    return apiInstance.get(
      apiConfig.endPoints.AGENT.PLAYER_LIST.replace(':agentUID', agentUID),
      {
        params: apiRequestParams
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },

  getUnassignedPlayerList: async (data) => {
    const { pagination, filters } = data;
    const apiRequestParams = {
      keyword: filters?.search || undefined,
      status: filters?.status ? parseAdminStatusToApi(filters.status) : undefined,
      per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
      page: pagination.pageIndex + 1
    };
    // TODO: Update this endpoint when API is ready
    return apiInstance.get(apiConfig.endPoints.AGENT.UNASSIGNED_PLAYERS, {
      params: apiRequestParams
    });
  },

  assignPlayersToAgent: async (agentUID, playerIds) => {
    const requestObject = {
      agentUID,
      playerIds
    };
    // TODO: Update this endpoint when API is ready
    return apiInstance.post(apiConfig.endPoints.AGENT.ASSIGN_PLAYERS, requestObject);
  },

  unassignPlayersFromAgent: async (agentUID, playerIds) => {
    const requestObject = {
      agentUID,
      playerIds
    };
    // TODO: Update this endpoint when API is ready
    return apiInstance.post(apiConfig.endPoints.AGENT.UNASSIGN_PLAYERS, requestObject);
  },

  // Commission Target Management
  getCommissionTargets: async (agentUID) => {
    return apiInstance.get(
      apiConfig.endPoints.SUPERVISOR.GET_TARGET.replace(':agentUID', agentUID)
    );
  },

  createCommissionTarget: async (agentUID, targetData) => {
    const requestObject = {
      agentId: agentUID,
      ...targetData
    };
    return apiInstance.post(
      apiConfig.endPoints.SUPERVISOR.CREATE_TARGET.replace(':agentUID', agentUID),
      requestObject
    );
  },

  updateCommissionTarget: async (agentUID, targetData) => {
    const requestObject = {
      agentId: agentUID,
      ...targetData
    };
    return apiInstance.put(
      apiConfig.endPoints.SUPERVISOR.UPDATE_TARGET.replace(':agentUID', agentUID),
      requestObject
    );
  },

  deleteCommissionTarget: async (agentUID, targetData) => {
    return apiInstance.delete(
      apiConfig.endPoints.SUPERVISOR.DELETE_TARGET.replace(':agentUID', agentUID),
      { params: targetData }
    );
  },

  getAgentDetail: (agentUID) => {
    const endPoint = replaceText(apiConfig.endPoints.AGENT.DETAIL, ':callingAgentUID', agentUID);
    return apiInstance.get(endPoint);
  },

  changeAgentStatus: (agentUID) => {
    const endPoint = replaceText(apiConfig.endPoints.AGENT.CHANGE_STATUS, ':agentId', agentUID);
    return apiInstance.put(endPoint);
  },

  createAgent: (supervisorUID, data) => {
    const requestObject = {
      supervisorUID,
      username: data.userName,
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      phoneCode: data.phoneCode,
      mobile: data.mobile,
      password: data.password,
      status: parseAdminStatusToApi(data.status)
    };
    return apiInstance.post(apiConfig.endPoints.AGENT.CREATE, requestObject);
  },

  editAgent: (data) => {
    const requestObject = {
      username: data.userName,
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      phoneCode: data.phoneCode,
      mobile: data.mobile,
      password: data.password || undefined,
      status: parseAdminStatusToApi(data.status),
      adminUID: data.adminUID
    };
    return apiInstance.post(apiConfig.endPoints.AGENT.EDIT, requestObject);
  },

  getRedeemRequests: async (data) => {
    const { pagination, agentUID, filters } = data || {};
    const apiRequestParams = {
      agentUID,
      keyword: filters?.keyword || undefined,
      status: filters?.status || undefined,
      startDate: filters?.startDate
        ? new Date(filters.startDate).toISOString().split('T')[0]
        : undefined,
      endDate: filters?.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : undefined,
      page: (pagination?.pageIndex || 0) + 1,
      perPage: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD
    };

    return apiInstance.get(apiConfig.endPoints.SUPERVISOR.REDEEM_COMMISSION_REQUESTS, {
      params: apiRequestParams
    });
  },

  updateRedeemRequestStatus: async (requestID, data) => {
    const requestObject = {
      status: data.status,
      remarks: data?.remarks || undefined,
      ...(data.approvedAmount && { approvedAmount: parseFloat(data.approvedAmount) })
    };

    return apiInstance.patch(
      apiConfig.endPoints.SUPERVISOR.COMMISSION_REQUESTS_STATUS_UPDATE.replace(
        ':requestID',
        requestID
      ),
      requestObject
    );
  },

  getAgentSummary: async (requestObject) => {
    if (!requestObject?.callingAgentUID) {
      throw new Error('Agent UID is required');
    }
    const params = {
      ...requestObject,
      startDate: requestObject.startDate
        ? dayjs(+requestObject.startDate).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endDate: requestObject.endDate
        ? dayjs(+requestObject.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
        : undefined
    };
    return apiInstance.get(apiConfig.endPoints.AGENT.GET_SUMMARY, { params });
  },
  getCommissionSummaryDetails: async (summaryID) => {
    return apiInstance.get(
      apiConfig.endPoints.AGENT.GET_SUMMARY_DETAILS.replace(':summaryId', summaryID)
    );
  },
  redeemCommissionRequest: async (summaryID) => {
    return apiInstance.post(
      apiConfig.endPoints.AGENT.REDEEM_COMMISSION_REQUESTS.replace(':redeemSummaryID', summaryID)
    );
  },
  getCommissionEvents: async (requestObject) => {
    // Extract date filters from filters object or root level
    const startDate = requestObject.filters?.startDate || requestObject.startDate;
    const endDate = requestObject.filters?.endDate || requestObject.endDate;

    const params = {
      ...requestObject,
      filters: JSON.stringify({
        ...requestObject.filters,
        // Remove date fields from filters as they should be at root level
        startDate: undefined,
        endDate: undefined
      }),
      // Add formatted dates at root level
      startDate: startDate ? dayjs(+startDate).toISOString() : undefined,
      endDate: endDate ? dayjs(+endDate).hour(23).minute(59).second(59).toISOString() : undefined,
      callingAgentUID: requestObject.callingAgentUID || undefined,
      page: requestObject.page || 1,
      perPage: requestObject.perPage || 10
    };
    return apiInstance.get(apiConfig.endPoints.AGENT.GET_TOTAL_EVENTS, { params });
  }
};

export default AgentService;
