import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';
const WalletService = {
  getWalletList: async (data) => {
    try {
      const params = {
        page: data.pageIndex + 1,
        per_page: data.pageSize
      };
      const endPoint = replaceText(apiConfig.endPoints.WALLET.LIST, ':userUID', data.userUID);
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: params
      });
      return response;
    } catch (error) {
      console.log('Error from Wallet List', error);
    }
  },
  getAllWalletList: async (data) => {
    try {
      const params = {
        page: data.pageIndex + 1,
        per_page: data.pageSize
      };
      const endPoint = replaceText(
        apiConfig.endPoints.WALLET.ALL_WALLET_LIST,
        ':userUID',
        data.userUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: params
      });
      return response;
    } catch (error) {
      console.log('Error from Wallet List', error);
    }
  }
};

export default WalletService;
