import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
const UserClassService = {
  userclassList: async (data) => {
    try {
      const { filters } = data;
      console.log('filters:', filters);

      const reqBody = {
        filters: {
          keyword: filters?.keyword || undefined
        }
      };
      const endPoint = apiConfig.endPoints.USER_CLASS.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqBody
      });
      return response;
    } catch (error) {
      console.log('Error from User Class List', error);
    }
  }
};

export default UserClassService;
