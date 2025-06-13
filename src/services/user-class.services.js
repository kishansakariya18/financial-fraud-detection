import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { userclassStatusToAPI } from 'app/pages/user-class/helper';
const UserClassService = {
  userclassList: async (data) => {
    try {
      const { filters, pagination } = data;
      console.log('filters:', filters);

      const reqBody = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filters: {
          keyword: filters?.keyword || undefined,
          status: userclassStatusToAPI(filters?.status)
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
