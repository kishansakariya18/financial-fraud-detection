import { parseProviderStatusToApi } from 'app/pages/casino-management/provider/helper';
import apiConfig from 'configs/api.config';
import { getEndDate, getStartDate } from 'helpers/functions';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const ProviderService = {
  getAllProviders: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.PROVIDER.ALL_LIST}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getProvidersSummary: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.PROVIDER.SUMMARY}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getProviderList: async (body) => {
    try {
      const { pagination, filters, isPaginationRequired = true } = body;

      const { status, keyword, startDate, endDate } = filters;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        status: status ? parseProviderStatusToApi(status) : undefined,
        keyword: keyword || undefined,
        startDate: startDate ? getStartDate(startDate) : undefined,
        endDate: endDate ? getEndDate(endDate) : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.PROVIDER.LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams, isPaginationRequired },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  editProvider: async (providerId, data, file) => {
    try {
      const endPoints = replaceText(apiConfig.endPoints.PROVIDER.EDIT, ':providerId', providerId);

      console.log('data: ::> ', data);

      const formData = new FormData();

      formData.append('name', data.providerName);

      if (file && file.name) {
        formData.append('image', file, file.name);
      }

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoints,
        method: 'PUT',
        body: formData,
        contentType: 'form-data',
        headers: {
          'Content-Type': "multipart/form-data'"
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changeProviderStatus: async (providerId) => {
    try {
      const endpoint = replaceText(
        apiConfig.endPoints.PROVIDER.CHANGE_STATUS,
        ':providerId',
        providerId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  restrictedCountryList: async (providerId, state) => {
    try {
      const apiBody = {
        filters: {
          keyword: state?.filters?.keyword ? state?.filters?.keyword : undefined
        }
      };

      const apiQueryParams = {
        page: state?.pagination ? state.pagination.pageIndex + 1 : (state?.page ?? 1),
        perPage: state?.pagination ? state.pagination.pageSize : (state?.perPage ?? 10)
      };

      const endPoints = replaceText(
        apiConfig.endPoints.PROVIDER.RESTRICTED_COUNTRY_LIST,
        ':providerId',
        providerId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoints,
        method: 'POST',
        body: apiBody,
        params: apiQueryParams,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  countryList: async (providerId, state) => {
    try {
      const apiBody = {
        filters: {
          keyword: state?.filters?.keyword ? state?.filters?.keyword : undefined
        }
      };
      const endPoints = replaceText(
        apiConfig.endPoints.PROVIDER.COUNTRY_LIST,
        ':providerId',
        providerId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoints,
        method: 'POST',
        body: apiBody,
        params: {
          page: state.pagination.pageIndex + 1,
          perPage: state.pagination.pageSize
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('error', error);
    }
  },
  addRestrictedCountry: async (providerId, countryIds) => {
    try {
      const apiBody = {
        countryIds
      };
      const endPoints = replaceText(
        apiConfig.endPoints.PROVIDER.ADD_RESTRICTED_COUNTRY,
        ':providerId',
        providerId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoints,
        method: 'POST',
        body: apiBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('error', error);
    }
  },
  removeRestrictedCountry: async (providerId, ids) => {
    try {
      const apiBody = {
        restrictedCountryIds: ids
      };
      const endPoints = replaceText(
        apiConfig.endPoints.PROVIDER.REMOVE_RESTRICTED_COUNTRY,
        ':providerId',
        providerId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoints,
        method: 'DELETE',
        body: apiBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('error', error);
    }
  }
};

export default ProviderService;
