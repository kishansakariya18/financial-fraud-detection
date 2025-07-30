import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const CurrencyService = {
  getCurrencyList: async (body) => {
    const { pagination, filters } = body;
    const { status, keyword } = filters;

    const apiQueryParams = {
      perPage: pagination.pageSize,
      page: pagination.pageIndex + 1
    };

    const apiRequestParams = {
      status: status || undefined,
      keyword: keyword || undefined
    };

    return await sendRequest({
      url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.CURRENCY.LIST}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { filters: apiRequestParams },
      params: apiQueryParams
    });
  },

  changeCurrencyStatus: async (currencyId) => {
    const endpoint = replaceText(
      apiConfig.endPoints.CURRENCY.CHANGE_STATUS,
      ':currencyId',
      currencyId
    );
    return await sendRequest({
      url: apiConfig.baseURL.API_BASE_URL + endpoint,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export default CurrencyService;
