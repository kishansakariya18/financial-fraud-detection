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
        per_page: pagination.pageSize,
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
  userclassAllList: async () => {
    try {
      const endPoint = apiConfig.endPoints.USER_CLASS.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          isPagination: false,
          page: '',
          per_page: '',
          filters: {
            keyword: '',
            status: ''
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from User Class All List', error);
    }
  },
  createUserClass: async (data) => {
    try {
      const reqBody = {
        className: data.className,
        classCode: data.classCode,
        rules: {
          deposit: data.deposit,
          wager: data.wager
        }
      };
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.USER_CLASS.CREATE,
        method: 'POST',
        body: reqBody,
        headers: {
          'Content-Type': 'application/json'
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
  userClassUpdate: async (data) => {
    try {
      const reqBody = {
        classUID: data.classUID,
        className: data.className,
        classCode: data.classCode,
        rules: {
          deposit: data.deposit,
          wager: data.wager
        }
      };
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.USER_CLASS.UPDATE,
        method: 'PUT',
        body: reqBody,
        headers: {
          'Content-Type': 'application/json'
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
  },
  userClassLimitList: async (data) => {
    try {
      const { filters, pagination } = data;
      console.log('filters:', filters);

      const reqBody = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        filters: {
          userClassID: filters?.userClassID || undefined,
          limitType: filters?.limitType || undefined,
          limitPeriod: filters?.limitPeriod || undefined
        }
      };
      const endPoint = apiConfig.endPoints.USER_CLASS_LIMIT.LIST;
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
  createUserClassLimit: async (data) => {
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.USER_CLASS_LIMIT.CREATE,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error creating user class limit:', error);
      throw error;
    }
  },
  updateUserClassLimit: async (data) => {
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.USER_CLASS_LIMIT.UPDATE,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error updating user class limit:', error);
      throw error;
    }
  },
  getUserClassLimitDetail: async (userClassLimitId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER_CLASS_LIMIT.DETAIL,
        ':userClassLimitUID',
        userClassLimitId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error fetching user class limit detail:', error);
      throw error;
    }
  },
  deleteUserClassLimit: async (userClassLimitId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER_CLASS_LIMIT.DELETE,
        ':userClassLimitUID',
        userClassLimitId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error deleting user class limit:', error);
      throw error;
    }
  },
  getMappedBanks: async (userClassUID, data) => {
    const endPoint = replaceText(
      apiConfig.endPoints.USER_CLASS.MAPPED_BANK,
      ':userClassUID',
      userClassUID
    );
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          page: data.pagination.pageIndex,
          limit: data.pagination.pageSize,
          keyword: data.filters.keyword,
          status: data.status
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getUnmappedBanks: async (userClassUID, data) => {
    const endPoint = replaceText(
      apiConfig.endPoints.USER_CLASS.UNMAPPED_BANK,
      ':userClassUID',
      userClassUID
    );
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          page: data.pagination.pageIndex,
          limit: data.pagination.pageSize,
          keyword: data.filters.keyword,
          status: data.status
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  mapBank: async (userClassUID, data) => {
    const endPoint = replaceText(
      apiConfig.endPoints.USER_CLASS.MAP_BANK,
      ':userClassUID',
      userClassUID
    );
    try {
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
      console.log('Error mapping bank:', err);
      throw err;
    }
  },
  unmapBank: async (userClassUID, data) => {
    const endPoint = replaceText(
      apiConfig.endPoints.USER_CLASS.UNMAP_BANK,
      ':userClassUID',
      userClassUID
    );
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { depositBankAccountID: data }
      });
      return response;
    } catch (err) {
      console.log('Error unmapping bank:', err);
      throw err;
    }
  }
};
export default UserClassService;
