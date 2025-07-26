import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';

const BankService = {
  getBankList: async ({ pagination }) => {
    try {
      const endPoint = apiConfig.endPoints.BANK.LIST;
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
          keyword: '',
          status: 1
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Bank List', error);
    }
  },
  createBank: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.BANK.CREATE;
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
      const endPoint = apiConfig.endPoints.BANK.UPDATE;
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
  changeStatus: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.BANK.CHANGE_STATUS;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error from Bank Change Status', error);
    }
  },
  bankDetail: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.BANK.DETAIL;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error from Bank Detail', error);
    }
  }
};

export default BankService;
