import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { replaceText } from 'utils/custom.utilities';

const SMSProviderService = {
  smsProviderList: async (data) => {
    try {
      const { pagination, filters } = data;
      const apiRequestParams = {
        filter: {
          keyword: filters.keyword ? filters.keyword : undefined,
          status: filters.status ? filters.status : undefined
        },
        limit: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      const endPoint = apiConfig.endPoints.SMS_PROVIDER.VIEW;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiRequestParams
      });

      return response;
    } catch (error) {
      console.log('Error from sms provider list', error);
    }
  },
  deleteProvider: async (providerUID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.SMS_PROVIDER.DELETE,
        ':providerUID',
        providerUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from delete provider', error);
    }
  },
  changeProviderStatus: async (providerUID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.SMS_PROVIDER.STATUS,
        ':providerUID',
        providerUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from provider status', error);
    }
  },
  getProviderDetails: async (providerUID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.SMS_PROVIDER.DETAIL,
        ':providerUID',
        providerUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.log('Error from get provider details', error);
    }
  },
  updateProvider: async (providerUID, data) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.SMS_PROVIDER.EDIT,
        ':providerUID',
        providerUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error from update provider', error);
    }
  }
};

export default SMSProviderService;
