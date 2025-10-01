import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const GlobalCommissionSettingService = {
  // Commission Settings - Get
  getCommissionSettings: async () => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.GLOBAL_COMMISSION_SETTINGS;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET'
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  },

  // Commission Settings - Update
  updateCommissionSettings: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.AFFILIATES.COMMISSION_SETTINGS_UPDATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      });
      return response;
    } catch (error) {
      return { status: 500, error: error?.message || 'Unexpected error' };
    }
  }
};

export default GlobalCommissionSettingService;
