import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const RegistrationFieldsService = {
  getAllRegistrationFields: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REGISTRATION_FIELDS.LIST}`,
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
  submitRegistrationFields: async (data) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REGISTRATION_FIELDS.SUBMIT}`,
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
export default RegistrationFieldsService;
