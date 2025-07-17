import { parseAdminStatusToApi } from 'app/pages/country/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
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
  }
};

export default BlacklistService;
