import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';

const PasswordManagerService = {
  changeUserFundPassword: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.USER.CHANGE_MANAGE_FUND_PASSWORD;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  },
  changeAffiliateFundPassword: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATE.CHANGE_MANAGE_FUND_PASSWORD;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  }
};

export default PasswordManagerService;
