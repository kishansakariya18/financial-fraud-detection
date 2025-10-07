import { parseUserKycStatusToAPI } from 'app/pages/player-kyc/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const UserKycServices = {
  getUserKycList: async (data) => {
    try {
      const { filters, pagination } = data;

      console.log('filters: ', filters);

      const apiFilters = {
        keyword: data.filters?.keyword,
        start_date: filters.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        end_date: filters.endDate
          ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        status: filters?.status ? parseUserKycStatusToAPI(filters?.status) : undefined,
        type: filters.type ? (filters.type === '3' ? 3 : filters.type === '2' ? 2 : 1) : undefined
      };
      const reqQuery = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize
      };

      const endPoint = apiConfig.endPoints.SETTINGS.USER_KYC.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        params: reqQuery,
        body: { filters: apiFilters }
      });
      return {
        ...response,
        totalRecord: response.response.data.total_record,
        perPage: response.response.data.per_page
      };
    } catch (error) {
      console.log('Error from user list', error);
    }
  },
  getUserKycDetails: async (documentId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.SETTINGS.USER_KYC.DETAILS,
        ':documentId',
        documentId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('Error from user list', error);
    }
  },
  updateKyc: async (data) => {
    try {
      const apiBodyData = {
        status: data.status,
        userId: data.userId,
        documentId: data.documentId,
        rejectReason: data?.rejectReason || ''
      };

      const endPoint = apiConfig.endPoints.SETTINGS.USER_KYC.UPDATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiBodyData
      });
      return response;
    } catch (error) {
      console.log('Error from user list', error);
    }
  }
};

export default UserKycServices;
