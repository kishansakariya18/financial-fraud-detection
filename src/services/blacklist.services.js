import { parseAdminStatusToApi } from 'app/pages/country/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';
// import { replaceText } from 'utils/custom.utilities';

const BlacklistService = {
  getBlacklistedIPList: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.BLACKLIST.LIST;
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
            status: filters.status ? parseAdminStatusToApi(filters.status) : 1,
            keyword: filters.keyword ? filters.keyword : '',
            type: 'ip'
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Blacklist IP List', error);
    }
  },
  getBlacklistedEntityList: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.BLACKLIST.LIST;
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
            status: filters.status ? parseAdminStatusToApi(filters.status) : 1,
            keyword: filters.keyword ? filters.keyword : '',
            type: 'entity'
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Entity IP List', error);
    }
  },
  blacklist: async ({ type, ipType, ipFrom, ipTo, value, reason }) => {
    try {
      const endPoint = apiConfig.endPoints.BLACKLIST.BLOCK;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          type,
          ipType,
          ipFrom,
          ipTo,
          value,
          reason
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Blacklist Block', error);
    }
  },
  deleteBlacklistItem: async (uid) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.BLACKLIST.DELETE, ':blacklistUID', uid);
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error deleting blacklist item', err);
    }
  },
  getDisposableEmailDomainList: async ({ pagination, filters }) => {
    try {
      const apiQueryParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filters: {
          domain: filters.keyword ? filters.keyword : null
        }
      };
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BLACKLIST.DISPOSABLE_EMAIL.LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiQueryParams
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  addDisposableEmailDomain: async (data) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BLACKLIST.DISPOSABLE_EMAIL.CREATE}`,
        method: 'POST',
        body: { domain: data.emailDomain },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  deleteDisposableEmailDomain: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.BLACKLIST.DISPOSABLE_EMAIL.DELETE,
        ':restrictedDomainID',
        id
      );
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${endPoint}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export default BlacklistService;
