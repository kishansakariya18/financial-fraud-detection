import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const CurrencyService = {
  getCurrencyList: async (body) => {
    const { pagination, filters } = body;
    const { status, keyword } = filters || {};

    const apiQueryParams = {
      per_page: pagination.pageSize,
      page: 1,
      status: status || undefined,
      keyword: keyword || undefined
    };

    return await sendRequest({
      url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.CURRENCY.LIST}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params: apiQueryParams
    });
  },

  changeCurrencyStatus: async (currencyId, changeStatus) => {
    const endpoint = replaceText(
      apiConfig.endPoints.CURRENCY.CHANGE_STATUS,
      ':currencyId',
      currencyId
    );
    return await sendRequest({
      url: apiConfig.baseURL.API_BASE_URL + endpoint,
      method: 'PATCH',
      body: {
        isActive: changeStatus == 'active' ? 0 : 1
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  createCurrency: async (data) => {
    console.log('data', data);
    return await sendRequest({
      url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.CURRENCY.CREATE}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: data.name,
        code: data.code,
        symbol: data.symbol,
        exchange_rate: data.exchange_rate,
        currencyType: data.type == 'Fiat' ? 0 : data.type == 'Crypto' ? 1 : 2,
        isActive: 0,
        exchangeUpdateType: 1,
        decimalPlaces: parseInt(data.decimal_places, 10)
      }
    });
  },
  // "code": "USD",
  // "name": "US Dollar",
  // "symbol": "$",
  // "decimalPlaces": 2,
  // "currencyType": 0,
  // "exchangeUpdateType": 1,
  // "isActive": 1

  addAdminExchangeRate: async (currencyId, data) => {
    const endpoint = replaceText(
      apiConfig.endPoints.CURRENCY.ADMIN_EXCHANGE_RATE,
      ':currencyId',
      currencyId
    );
    return await sendRequest({
      url: apiConfig.baseURL.API_BASE_URL + endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
  },

  getCurrencyById: async (currencyId) => {
    return sendRequest({
      method: 'GET',
      url: apiConfig.endPoints.CURRENCY.GET_BY_ID.replace(':currencyId', currencyId),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  updateCurrency: async (currencyId, data) => {
    const endpoint = replaceText(apiConfig.endPoints.CURRENCY.UPDATE, ':currencyId', currencyId);
    return await sendRequest({
      url: apiConfig.baseURL.API_BASE_URL + endpoint,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
  },
  deleteCurrency: async (currencyId) => {
    const endpoint = replaceText(apiConfig.endPoints.CURRENCY.DELETE, ':currencyId', currencyId);
    return await sendRequest({
      url: apiConfig.baseURL.API_BASE_URL + endpoint,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export default CurrencyService;
