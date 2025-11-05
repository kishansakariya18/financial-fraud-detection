import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import apiInstance from 'utils/apiInstance';

const PlatformLimitService = {
  getPlatoformLimit: async () => {
    try {
      const endPoint = apiConfig.endPoints.RISK_MANAGEMENT.LIST;
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
      console.log('Error from Risk management List', error);
    }
  },
  updatePlatformLimit: async (data) => {
    try {
      const apiBodyData = {
        BetLimit: data.oneTimeBetLimit || undefined,
        WinLimit: data.oneTimeWinLimit || undefined,
        MaxDepositPerDay: data.dailyDepositLimit || undefined,
        MaxWithdrawPerDay: data.dailyWithdrawLimit || undefined,
        CheckCalanderTime: data.isCheckCaladerTime
      };

      const endPoint = apiConfig.endPoints.RISK_MANAGEMENT.UPDATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiBodyData
      });
      return response;
    } catch (error) {
      console.log('Error from Risk management Update', error);
    }
  },
  getPlatformLimitHistory: async (filters = {}) => {
    return apiInstance.post(apiConfig.endPoints.RISK_MANAGEMENT.HISTORY, {
      page: filters.page || 1,
      per_page: filters.per_page || 100,
      filters: {
        ...(filters.limitType && { limitType: filters.limitType }),
        ...(filters.limitPeriod && { limitPeriod: filters.limitPeriod }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      }
    });
  }
};

export default PlatformLimitService;
