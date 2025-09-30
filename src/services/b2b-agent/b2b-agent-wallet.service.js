import {
  parseCreditDebitTypeToApi,
  parseTransactionTypeToApi
} from 'components/sections/b2b-agents/helper';
import apiConfig from '../../configs/api.config';
import { CREDIT_DEBIT_TYPE, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import apiInstance from 'utils/apiInstance';
import moment from 'moment';

const B2BAgentWalletService = {
  // getAllAgent: async (data) => {
  //   const { pagination, filters } = data;

  //   const apiRequestParams = {
  //     keyword: filters.keyword || undefined,
  //     status: filters.status ? parseAgentStatusToApi(filters.status) : undefined,
  //     agentType: filters.agentType ? parseAgentTypeToApi(filters.agentType) : undefined,
  //     startDate: filters.startDate ? moment(+filters.startDate).startOf('day').toDate() : undefined,
  //     endDate: filters.endDate ? moment(+filters.endDate).endOf('day').toDate() : undefined,
  //     perPage: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
  //     page: pagination.pageIndex + 1
  //   };

  //   return apiInstance.post(apiConfig.endPoints.B2B_AGENT.LIST, apiRequestParams);
  // },
  //   router.post('/admin/agent/:agentID/credit-debit', adminAuth, agentCreditDebitValidator, validate, creditDebitAdminAgent)
  // router.post('/agent/:agentID/credit-debit', agentAuth, agentCreditDebitValidator, validate, creditDebitAgent)
  // router.post('/agent/:agentID/player/:userUID/credit', agentAuth, agentCreditPlayerValidator, validate, creditAgentPlayer)
  // router.post('/agent/transaction/list', agentAuth, validate, agentTransactionList)
  // router.post('/agent/:agentID/withdraw-requests', agentAuth, validate, playerWithdrawRequestList)
  // router.post('/agent/:withdrawRequestID/handle-withdraw-request', agentAuth, validate, handleWithdrawFundRequest)
  // router.get('/agent/:agentID/wallet', agentAuth, validate, getAgentWallet)
  adminAddCreditDebit: async (data) => {
    const { agentUID, amount = 0, creditDebitType = CREDIT_DEBIT_TYPE.CREDIT } = data;
    return apiInstance.post(
      apiConfig.endPoints.B2B_AGENT.WALLET.CREDIT_DEBIT_ADMIN_AGENT(agentUID),
      { amount, creditDebitType }
    );
  },
  agentAddCreditDebit: async (data) => {
    const { agentUID, amount = 0, creditDebitType = CREDIT_DEBIT_TYPE.CREDIT } = data;
    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.WALLET.CREDIT_DEBIT_AGENT(agentUID), {
      amount,
      creditDebitType
    });
  },
  agentAddCreditAgentPlayer: async (data) => {
    const { agentUID, userUID, amount = 0 } = data;
    return apiInstance.post(
      apiConfig.endPoints.B2B_AGENT.WALLET.CREDIT_AGENT_PLAYER(agentUID, userUID),
      { amount }
    );
  },
  agentTransactionList: async (data) => {
    const { pagination, creditDebitType, transactionType, agentUID, startDate, endDate } = data;
    const body = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize || DEFAULT_PER_PAGE_RECORD,
      creditDebitType: creditDebitType ? parseCreditDebitTypeToApi(creditDebitType) : undefined,
      transactionType: transactionType ? parseTransactionTypeToApi(transactionType) : undefined,
      startDate: startDate ? moment(Number(startDate)).startOf('day').toDate() : undefined,
      endDate: endDate ? moment(Number(endDate)).endOf('day').toDate() : undefined
    };
    return apiInstance.post(
      apiConfig.endPoints.B2B_AGENT.WALLET.AGENT_TRANSACTION_LIST(agentUID),
      body
    );
  },
  getAgentWallet: async (data) => {
    const { agentUID } = data;
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.WALLET.GET_AGENT_WALLET(agentUID));
  },

  createWithdrawRequest: async (data) => {
    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.WALLET.CREATE_WITHDRAW_REQUEST, data);
  },

  withdrawRequestList: async (data) => {
    const { pagination, filters } = data;
    const apiRequestParams = {
      ...(data.fromAgentUID ? { fromAgentUID: data.fromAgentUID } : {}),
      ...(data.toAgentUID ? { toAgentUID: data.toAgentUID } : {}),
      status: filters.status || undefined,
      entityType: filters.entityType || undefined,
      limit: pagination?.pageSize || 10,
      page: pagination.pageIndex + 1
    };
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.WALLET.WITHDRAW_REQUEST_LIST, {
      params: apiRequestParams
    });
  },

  updateWithdrawRequestStatus: async (data) => {
    try {
      const apiRequestParams = {
        requestId: data.requestId,
        status: data.status,
        remarks: data.remarks || ''
      };
      return apiInstance.post(
        apiConfig.endPoints.B2B_AGENT.WALLET.WITHDRAW_REQUEST_UPDATE_STATUS(data.requestId),
        apiRequestParams
      );
    } catch (error) {
      console.error('Update Withdraw Request Status Error:', error);
      throw error;
    }
  },
  manualAdjustment: async (data) => {
    return apiInstance.post(apiConfig.endPoints.B2B_AGENT.WALLET.AGENT_MANUAL_ADJUSTMENT, data);
  }
};

export default B2BAgentWalletService;
