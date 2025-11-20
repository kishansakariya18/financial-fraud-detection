import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';

const KycConfigurationsService = {
  getLevelConfig: async () => {
    try {
      const endPoint = apiConfig.endPoints.SETTINGS.KYC_CONFIGURATIONS.GET_CONFIGURATIONS;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {}
      });

      return response;
    } catch (err) {
      console.log('Error fetching KYC level config', err);
    }
  },
  updateLevelConfig: async (mappings) => {
    try {
      const endPoint = apiConfig.endPoints.SETTINGS.KYC_CONFIGURATIONS.UPDATE_CONFIGURATIONS;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: mappings
      });

      return response;
    } catch (err) {
      console.log('Error updating KYC level config', err);
    }
  }
};

export default KycConfigurationsService;
