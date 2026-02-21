import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const TransactionService = {
  createTransaction: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.USER.ALL_TRANSACTION_LIST;
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
      console.log('Error from createTransaction', error);
      throw error;
    }
  }
};

export default TransactionService;
