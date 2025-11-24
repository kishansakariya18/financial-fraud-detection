import apiConfig from 'configs/api.config';
import apiInstance from 'utils/apiInstance';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const CurrencyService = {
  getCurrencyList: async (body) => {
    const { pagination, filters } = body;
    const { status, keyword } = filters || {};

    console.log('status: ', status);
    const apiQueryParams = {
      per_page: pagination.pageSize,
      page: pagination.pageIndex + 1
    };

    // Add status filter only if a specific status is selected
    if (status) {
      apiQueryParams['filters[isActive]'] = status == 'active' ? 1 : 0;
    }

    // Add keyword filter only if it exists
    if (keyword) {
      apiQueryParams['filters[keyword]'] = keyword;
    }

    return await sendRequest({
      url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.CURRENCY.LIST}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params: apiQueryParams
    });
  },

  getDefaultCurrency: async () => {
    return apiInstance.get(apiConfig.endPoints.CURRENCY.DEFAULT);
  },

  getCurrencyCodeList: async () => {
    return await sendRequest({
      url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.CURRENCY.CODES}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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
        // Prefer currencyType passed from UI (derived from selected code). Fallback to legacy mapping if absent.
        currencyType: data.currencyType == 'Fiat' ? 0 : data.currencyType == 'Crypto' ? 1 : 2,
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
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { rate: data.exchange_rate }
    });
  },
  changeExchangeUpdateType: async (currencyId, exchangeUpdateType) => {
    const endpoint = replaceText(
      apiConfig.endPoints.CURRENCY.ADMIN_EXCHANGE_TYPE_UPDATE,
      ':currencyId',
      currencyId
    );
    return await sendRequest({
      url: apiConfig.baseURL.API_BASE_URL + endpoint,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { exchangeUpdateType: exchangeUpdateType === 'Manual' ? 1 : 0 }
    });
  },

  getCurrencyById: async (currencyId) => {
    return sendRequest({
      method: 'GET',
      url:
        apiConfig.baseURL.API_BASE_URL +
        apiConfig.endPoints.CURRENCY.GET_BY_ID.replace(':currencyId', currencyId),
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
      body: {
        name: data.name,
        code: data.code,
        symbol: data.symbol,
        // Prefer currencyType from request; fallback to legacy mapping based on type string
        currencyType:
          data.currencyType !== undefined && data.currencyType !== null
            ? data.currencyType
            : data.type == 'Fiat'
              ? 0
              : data.type == 'Crypto'
                ? 1
                : 2,
        decimalPlaces: parseInt(data.decimal_places, 10)
      }
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
  },
  getExchangeRateHistory: async (currencyId, body) => {
    const endpoint = replaceText(
      apiConfig.endPoints.EXCHANGE_RATE.HISTORY,
      ':currencyId',
      currencyId
    );
    return await sendRequest({
      url: apiConfig.baseURL.API_BASE_URL + endpoint,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        page: body.pagination.pageIndex + 1,
        per_page: body.pagination.pageSize
      }
    });
  },
  getCurrencyCodes: async () => {
    return await sendRequest({
      url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.CURRENCY.CODES}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  getPlatformCurrancyCodes: async () => {
    return apiInstance.get(apiConfig.endPoints.CURRENCY.PLATFORM_CODE_LIST, {
      params: { isActive: 1 }
    });
  }
};

export default CurrencyService;
