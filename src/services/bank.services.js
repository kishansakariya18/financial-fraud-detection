import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { replaceText } from 'utils/custom.utilities';

const BankService = {
  getBankList: async ({ pagination, keyword, status }) => {
    try {
      const endPoint = apiConfig.BANK.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          limit: pagination.pageSize,
          page: pagination.pageIndex + 1,
          keyword: keyword,
          status: status
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Bank List', error);
    }
  },
  createBank: async (data) => {
    try {
      const endPoint = apiConfig.BANK.CREATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error from Bank Create', error);
    }
  },
  updateBank: async (data) => {
    try {
      const endPoint = replaceText(apiConfig.BANK.EDIT, ':bankId', data.id);
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
      console.log('Error from Bank Update', error);
    }
  },
  changeStatus: async (id) => {
    try {
      const endPoint = replaceText(apiConfig.BANK.CHANGE_STATUS, ':bankId', id);
      //const endPoint = apiConfig.endPoints.BANK.CHANGE_STATUS;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {}
      });
      return response;
    } catch (error) {
      console.log('Error from Bank Change Status', error);
    }
  },
  bankDetail: async (data) => {
    try {
      console.log(data);
      const endPoint = replaceText(apiConfig.BANK.DETAIL, ':bankId', data);
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
      console.log('Error from Bank Detail', error);
    }
  }
};

export default BankService;
