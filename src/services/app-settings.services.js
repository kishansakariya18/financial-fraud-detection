import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';

const AppSettingsService = {
  updateAppSettings: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.APP_SETTINGS.UPDATE;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export default AppSettingsService;
