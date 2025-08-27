import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { gatewayStatusToAPI } from 'app/pages/payment-provider/helper';
import { replaceText } from 'utils/custom.utilities';

const PaymentProviderService = {
  paymentProviderList: async (data) => {
    try {
      const { pagination, filters } = data;

      console.log('data: ', data);
      const apiRequestParams = {
        keyword: filters.keyword ? filters.keyword : undefined,
        status: filters.status ? gatewayStatusToAPI(filters.status) : undefined,
        per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      console.log('apiRequestParams: ', apiRequestParams);
      const endPoint = apiConfig.endPoints.PAYMENT_PROVIDER.VIEW;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiRequestParams
      });
      console.log('response is ', response);

      return response;
    } catch (error) {
      console.log('Error from payment provider List', error);
    }
  },
  changePlayerStatus: async (gatewayID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.PAYMENT_PROVIDER.STATUS,
        ':gatewayId',
        gatewayID
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
      console.log('Error from userStatus', error);
    }
  }
};

export default PaymentProviderService;
