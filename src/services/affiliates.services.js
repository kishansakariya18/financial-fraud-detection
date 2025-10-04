import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import dayjs from 'dayjs';
import axios from 'axios';

const AffiliatesService = {
  getList: async ({ pagination, filters }) => {
    try {
      const reqBody = {
        filters: {
          keyword: filters?.keyword,
          startDate: filters?.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endDate: filters?.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          status: filters?.status || undefined
        },
        ...(!pagination && { pagination: false })
      };
      const endPoint = apiConfig.endPoints.AFFILIATES.AFFILIATE_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const apiRes = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: { page: pagination.pageIndex + 1, perPage: pagination.pageSize },
        body: reqBody
      });
      return apiRes;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getAffiliateDetail: async ({ affiliateId, pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.AFFILIATE_DETAIL.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: pagination
          ? { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
          : undefined,
        body: {
          filter: {
            keyword: filters?.keyword || ''
          }
        }
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getCampaignList: async ({ affiliateId, pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.CAMPAIGNS_LIST.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: pagination
          ? { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
          : undefined,
        body: {
          filter: {
            keyword: filters?.keyword || ''
          }
        }
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getReferredUsersCommissionTransactions: async ({
    affiliateId,
    pagination,
    filters = {},
    userID
  }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.TRANSACTION_LIST.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

      const reqBody = {
        ...(userID && { userID: String(userID) }),
        filter: {
          keyword: filters?.keyword ?? '',
          startDate: filters?.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : '',
          endDate: filters?.endDate
            ? dayjs(+filters.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
            : '',
          txnStatus:
            typeof filters?.txnStatus !== 'undefined' && filters?.txnStatus !== null
              ? String(filters.txnStatus)
              : '',
          type:
            typeof filters?.type !== 'undefined' && filters?.type !== null
              ? String(filters.type)
              : '',
          currencyID:
            typeof filters?.currencyID !== 'undefined' && filters?.currencyID !== null
              ? String(filters.currencyID)
              : ''
        }
      };

      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: pagination
          ? { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
          : undefined,
        body: reqBody
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getReferrals: async ({ affiliateId, pagination, filters, campaignID }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.REFERRAL_LIST.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: { page: pagination.pageIndex + 1, perPage: pagination.pageSize },
        body: {
          filter: {
            keyword: filters?.keyword || ''
          },
          campaignID: campaignID || ''
        }
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getWithdrawals: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.WITHDRAWAL_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const reqBody = {
        filters: {
          keyword: filters?.keyword || undefined,
          currencyCode: filters?.currencyCode || undefined,
          affiliateUID: filters?.affiliateUID || undefined,
          txnStatus:
            (filters?.txnStatus || filters?.transactionStatus)?.toString().toUpperCase() ||
            undefined,
          startDate: filters?.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endDate: filters?.endDate
            ? dayjs(+filters.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
            : undefined
        }
      };
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: { page: pagination.pageIndex + 1, perPage: pagination.pageSize },
        body: reqBody
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  approveWithdrawal: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.WITHDRAWAL_APPROVE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  rejectWithdrawal: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.WITHDRAWAL_REJECT;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getCampaignDetail: async ({ campaignUID, pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.CAMPAIGN_DETAILS.replace(
        '{campaignUID}',
        campaignUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: pagination
          ? { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
          : undefined,
        body: {
          filters: {
            keyword: filters?.keyword || ''
          }
        }
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getCommissionSummary: async ({ affiliateId, pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.COMMISSION_SUMMARY.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: pagination
          ? { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
          : undefined,
        body: {
          filter: {
            keyword: filters?.keyword || ''
          }
        }
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  // Commission Settings - Get
  getCommissionSettings: async ({ affiliateId }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.COMMISSION_SETTINGS.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET'
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  // Commission Settings - Update
  updateCommissionSettings: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.COMMISSION_SETTINGS_UPDATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },
  getAffiliatesTransactions: async ({ affiliateId, pagination, filters = {}, userID }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.AFFILIATE_TRANSACTIONS.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

      const reqBody = {
        ...(userID && { userID: String(userID) }),
        filter: {
          keyword: filters?.keyword ?? '',
          startDate: filters?.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : '',
          endDate: filters?.endDate
            ? dayjs(+filters.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
            : '',
          txnStatus:
            typeof filters?.txnStatus !== 'undefined' && filters?.txnStatus !== null
              ? String(filters.txnStatus)
              : '',
          txnType:
            typeof filters?.txnType !== 'undefined' && filters?.txnType !== null
              ? String(filters.txnType)
              : '',
          type:
            typeof filters?.type !== 'undefined' && filters?.type !== null
              ? String(filters.type)
              : '',
          currencyID:
            typeof filters?.currencyID !== 'undefined' && filters?.currencyID !== null
              ? String(filters.currencyID)
              : ''
        }
      };

      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: pagination
          ? { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
          : undefined,
        body: reqBody
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  }
};

AffiliatesService.exportCampaignReport = async ({ affiliateId }) => {
  try {
    if (!affiliateId || String(affiliateId).trim() === '') {
      return { status: 400, error: 'Invalid affiliateId to export report' };
    }
    const endPoint = apiConfig.endPoints.AFFILIATES.CAMPAIGN_REPORT;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

    const res = await axios.request({
      url: apiURL,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { userId: String(affiliateId) },
      responseType: 'blob'
    });

    return { status: res.status, response: res.data };
  } catch (error) {
    const status = error?.response?.status || 500;
    let errMsg =
      (typeof error?.response?.data === 'string'
        ? error.response.data
        : error?.response?.data?.message) || 'Failed to export report';
    return { status, error: errMsg || error?.message || 'Unexpected error' };
  }
};

export default AffiliatesService;
