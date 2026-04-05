import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const TransactionService = {
  createTransaction: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.USER.ALL_TRANSACTION_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      return await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
    } catch (error) {
      console.log('Error from createTransaction', error);
      throw error;
    }
  },

  /** GET /transactions — same resource as list; fraud fields are filled by backend after async processing */
  getTransactions: async (params = {}) => {
    const endPoint = apiConfig.endPoints.USER.ALL_TRANSACTION_LIST;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
    const query = {
      page: 1,
      limit: 10,
      sortBy: 'transactionDate',
      sortOrder: 'desc',
      ...params
    };
    try {
      return await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: query
      });
    } catch (error) {
      console.log('Error from getTransactions', error);
      throw error;
    }
  }
};

export default TransactionService;
