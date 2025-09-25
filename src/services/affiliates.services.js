import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import dayjs from 'dayjs';

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
        // getAffiliateDetail: async ({ affiliateId }) => {
        //   try {
        //     const endPoint = apiConfig.endPoints.AFFILIATES.AFFILIATE_DETAIL.replace(
        //       '{affiliateId}',
        //       affiliateId
        //     );
        //     const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
        //     const response = await sendRequest({
        //       url: apiURL,
        //       method: 'POST',
        //       headers: { 'Content-Type': 'application/json' },
        //       body: {
        //         filters: {
        //           keyword: 'B67gKIYarwa'
        //         }
        //       }
        //     });
        //     return response;
        //   } catch (error) {
        //     return { status: 500, error: error?.message || 'Unexpected error' };
        //   }
        // },
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
  getAffiliateDetail: async ({ affiliateId, pagination }) => {
    try {
      console.log(affiliateId);
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
            keyword: ''
          }
        }
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getReferrals: async ({ affiliateId, pagination }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.REFERRAL_LIST.replace(
        '{affiliateId}',
        affiliateId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params: { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  getWithdrawals: async ({ pagination }) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.WITHDRAWAL_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params: { page: pagination.pageIndex + 1, perPage: pagination.pageSize }
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
  }
};

export default AffiliatesService;
