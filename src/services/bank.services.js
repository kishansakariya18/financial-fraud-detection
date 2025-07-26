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
  }
};

export default BankService;
