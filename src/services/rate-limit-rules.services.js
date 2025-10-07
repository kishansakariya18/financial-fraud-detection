import { parseRateLimitRuleStatusToApi } from 'app/pages/rate-limit-rules/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const RateLimitRuleService = {
  getRateLimitRulesList: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.RATE_LIMIT_RULES.LIST;
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
            status: filters.status ? parseRateLimitRuleStatusToApi(filters.status) : undefined
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from RateLimit List', error);
    }
  },
  updateRateLimitRuleStatus: async (rateLimitUID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RATE_LIMIT_RULES.CHANGE_STATUS,
        ':rateLimitUID',
        rateLimitUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from RateLimit Update Status', error);
    }
  },
  getRateLimitRuleById: async (rateLimitUID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RATE_LIMIT_RULES.DETAIL,
        ':rateLimitUID',
        rateLimitUID
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
      console.log('Error from RateLimit Get Detail', error);
    }
  },
  updateRateLimitRule: async (rateLimitUID, data) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RATE_LIMIT_RULES.UPDATE,
        ':rateLimitUID',
        rateLimitUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          maxAttempts: data.maxAttempts,
          blockMinutes: data.blockMinutes,
          windowMinutes: data.windowMinutes
        }
      });
      return response;
    } catch (error) {
      console.log('Error from RateLimit Update', error);
    }
  }
};

export default RateLimitRuleService;
