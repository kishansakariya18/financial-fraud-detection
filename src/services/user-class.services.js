import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { userclassStatusToAPI } from 'app/pages/user-class/helper';
import { replaceText } from 'utils/custom.utilities';
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
  },
  createUserClass: async (data, file) => {
    try {
      const formData = new FormData();
      formData.append('className', data.className);
      formData.append('classCode', data.classCode);

      if (file && file.name) {
        formData.append('avatarURL', file, file.name);
      }

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.USER_CLASS.CREATE,
        method: 'POST',
        body: formData,
        contentType: 'form-data',
        headers: {
          'Content-Type': "multipart/form-data'"
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  userClassDetail: async (id) => {
    const endPoint = replaceText(apiConfig.endPoints.USER_CLASS.DETAIL, ':userClassUID', id);
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'GET'
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  userClassUpdate: async (data, file) => {
    try {
      const formData = new FormData();
      formData.append('className', data.className);
      formData.append('classCode', data.classCode);
      formData.append('classId', data.classId);
      if (file && file.name) {
        formData.append('avatarURL', file, file.name);
      }
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.USER_CLASS.UPDATE,
        method: 'PUT',
        body: formData,
        contentType: 'form-data',
        headers: {
          'Content-Type': "multipart/form-data'"
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  userClassChangeStatus: async (userClassUID) => {
    const endPoint = replaceText(
      apiConfig.endPoints.USER_CLASS.CHANGE_STATUS,
      ':userClassUID',
      userClassUID
    );
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  userClassDelete: async (userClassUID) => {
    const endPoint = replaceText(
      apiConfig.endPoints.USER_CLASS.DELETE,
      ':userClassUID',
      userClassUID
    );
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};
export default UserClassService;
