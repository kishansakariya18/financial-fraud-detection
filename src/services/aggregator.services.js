import { parseAggregatorStatusToApi } from 'app/pages/casino-management/aggregator/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const AggregatorService = {
  getAggregators: async ({ pagination = {}, filters = {} } = {}) => {
    try {
      const { pageIndex = 0, pageSize = 10 } = pagination;
      const { keyword, status } = filters;

      const params = {
        page: pageIndex + 1,
        perPage: pageSize,
        ...(keyword ? { keyword } : {}),
        ...(status !== undefined && status !== null
          ? { isActive: parseAggregatorStatusToApi(status) }
          : {})
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AGGREGATOR.LIST}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params
      });

      return response;
    } catch (error) {
      console.error('AggregatorService.getAggregators error', error);
      return {
        status: error?.status || 500,
        response: null,
        error: error?.message || 'Unable to fetch aggregators.'
      };
    }
  },
  fetchQtGames: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AGGREGATOR.FETCH_QT_GAMES}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.error('AggregatorService.fetchQtGames error', error);
      return {
        status: error?.status || 500,
        response: null,
        error: error?.message || 'Unable to fetch qt games.'
      };
    }
  },
  fetchSoftswissGames: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AGGREGATOR.FETCH_SOFTSWISS_GAMES}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.error('AggregatorService.fetchSoftswissGames error', error);
      return {
        status: error?.status || 500,
        response: null,
        error: error?.message || 'Unable to fetch softswiss games.'
      };
    }
  }
};

export default AggregatorService;
