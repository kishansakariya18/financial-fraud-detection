import { parseAdminStatusToApi } from 'app/pages/users/admin/helper';
import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import dayjs from 'dayjs';
import { replaceText } from 'utils/custom.utilities';
// import dayjs from 'dayjs';
// import { parseAdminStatusToApi } from '../pages/admin/helper';
// import { replaceText } from '../helpers/functions';

const AdminService = {
  getAllAdmin: async (data) => {
    try {
      const { pagination, filters } = data;

      console.log('data: ', data);

      const apiRequestParams = {
        filters: {
          keyword: filters.keyword ? filters.keyword : undefined,
          status: filters.status ? parseAdminStatusToApi(filters.status) : undefined,
          start_date: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          end_date: filters.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        },
        per_page: pagination?.pageSize || 10,
        page: pagination.pageIndex + 1
      };

      console.log('apiRequestParams: ', apiRequestParams);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.ADMIN_USER.ADMIN_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiRequestParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getAdminDetail: async (id) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.ADMIN_USER.ADMIN_DETAIL, ':adminId', id);
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
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
  changeAdminStatus: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.ADMIN_USER.ADMIN_CHANGE_STATUS,
        ':adminId',
        id
      );
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
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
  // deleteAdmin: async (id) => {
  //   try {
  //     const endPoint = replaceText(apiConfig.endPoints.ADMIN_USER.ADMIN_DELETE, ':adminId', id);

  //     const response = await sendRequest({
  //       url: apiConfig.baseURL.REACT_APP_API_URL + endPoint,
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     return response;
  //   } catch (err) {
  //     console.log('Error', err);
  //   }
  // },
  getAdminRole: async () => {
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.ADMIN_USER.ADMIN_ROLE_LIST,
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
  createAdmin: async (data) => {
    try {
      const requestObject = {
        username: data.userName,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        status: parseAdminStatusToApi(data.status),
        is_master_admin: data.isMasterAdmin ? 1 : 0,
        role: data.roles
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.ADMIN_USER.ADMIN_CREATE,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  editAdmin: async (data) => {
    try {
      const requestObject = {
        username: data.userName,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        mobile: data.mobile,
        password: data.password || undefined,
        status: parseAdminStatusToApi(data.status),
        is_master_admin: data.isMasterAdmin ? 1 : 0,
        role: data.roles,
        adminId: data.adminId
      };

      console.log(requestObject);

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.ADMIN_USER.ADMIN_EDIT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
  // checkPassword: async (type, password) => {
  //   try {
  //     const endPoint = apiConfig.endPoints.ADMIN_USER.ADMIN_CHECK_PASSWORD;
  //     const response = await sendRequest({
  //       url: apiConfig.baseURL.REACT_APP_API_URL + endPoint,
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: {
  //         type,
  //         password
  //       }
  //     });

  //     return response;
  //   } catch (err) {
  //     console.log('Error', err);
  //   }
  // },
  // updateProfile: async (data) => {
  //   try {
  //     console.log('data: ', data);
  //     const requestObject = {
  //       username: data.username.trim(),
  //       firstname: data.firstname.trim(),
  //       lastname: data.lastname.trim(),
  //       email: data.email.trim(),
  //       mobile: data.mobile.trim()
  //     };
  //     const response = await sendRequest({
  //       url: apiConfig.baseURL.REACT_APP_API_URL + apiConfig.endPoints.ADMIN_USER.UPDATE_PROFILE,
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: requestObject
  //     });
  //     return response;
  //   } catch (error) {
  //     console.log('error in update profile: ', error);
  //   }
  // },
  // getAdminLoginHistory: async (reqBody) => {
  //   try {
  //     const query = {
  //       page: +reqBody.currentPage,
  //       perPage: +reqBody.perPage
  //     };
  //     const endPoint = replaceText(apiConfig.endPoints.ADMIN_USER.ADMIN_LOGIN_HISTORY, ':adminID', reqBody.adminID);
  //     const apiURL = apiConfig.baseURL.REACT_APP_API_URL + endPoint;
  //     const response = await sendRequest({
  //       url: apiURL,
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       params: query
  //     });
  //     return response;
  //   } catch (error) {
  //     console.log('Error from getAdminLoginHistory ', error);
  //   }
};

export default AdminService;
