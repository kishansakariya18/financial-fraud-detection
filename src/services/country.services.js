import { parseAdminStatusToApi } from 'app/pages/country/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const CountryService = {
  getCountry: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.GEORESTRICTION.COUNTRY_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          filters: {
            keyword: filters.keyword ? filters.keyword : '',
            status: filters.status ? parseAdminStatusToApi(filters.status) : 1,
            globallyBlocked: filters.globallyBlocked ?? null
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Country List', error);
    }
  },
  updateCountryStatus: async (countryId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.COUNTRY.CHANGE_STATUS,
        ':countryId',
        countryId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Country Update Status', error);
    }
  },
  getCountrySummary: async () => {
    try {
      const endPoint = apiConfig.endPoints.COUNTRY.SUMMARY;

      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from getCountrySummary', error);
    }
  },
  getCountryBlockedModules: async (pagination, filters, countryId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.GEORESTRICTION.BLOCKED_MODULES,
        ':countryId',
        countryId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          filters: {
            keyword: filters.keyword || '',
            globallyBlocked: filters.globallyBlocked ?? null
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from getCountryBlockedModules', error);
      return { status: 500, error: 'Failed to fetch blocked modules' };
    }
  },
  getCountryBlockedProviders: async (pagination, filters, countryId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.GEORESTRICTION.BLOCKED_PROVIDERS,
        ':countryId',
        countryId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          filters: {
            keyword: filters.keyword || '',
            globallyBlocked: filters.globallyBlocked ?? null
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from getCountryBlockedProviders', error);
      return { status: 500, error: 'Failed to fetch blocked providers' };
    }
  },
  blockModule: async (moduleUID, isRestricted, countryId, reason) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.GEORESTRICTION.BLOCK_MODULE,
        ':countryId',
        countryId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          moduleUID: moduleUID,
          isRestricted: isRestricted,
          RestrictionReason: reason ?? undefined
        }
      });
      return response;
    } catch (error) {
      console.log('Error from blockModule', error);
      return { status: 500, error: 'Failed to block module' };
    }
  },
  blockProvider: async (providerUID, isRestricted, countryId, reason) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.GEORESTRICTION.BLOCK_PROVIDER,
        ':countryId',
        countryId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          providerUID: providerUID,
          isRestricted: isRestricted,
          RestrictionReason: reason ?? undefined
        }
      });
      return response;
    } catch (error) {
      console.log('Error from blockProvider', error);
      return { status: 500, error: 'Failed to block provider' };
    }
  },
  blockCountry: async (countryId, reason) => {
    try {
      const endPoint = apiConfig.endPoints.GEORESTRICTION.BLOCK_COUNTRY;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          countryId: countryId,
          notes: reason ?? undefined
        }
      });
      return response;
    } catch (error) {
      console.log('Error from blockCountry', error);
      return { status: 500, error: 'Failed to block country' };
    }
  },
  unblockCountry: async (countryId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.GEORESTRICTION.UNBLOCK_COUNTRY,
        ':countryId',
        countryId
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
      console.log('Error from unblockCountry', error);
      return { status: 500, error: 'Failed to unblock country' };
    }
  }
};

export default CountryService;
