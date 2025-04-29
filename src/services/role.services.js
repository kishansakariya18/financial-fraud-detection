import { replaceText } from 'utils/custom.utilities';
import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
const RoleService = {
  roleList: async (data) => {
    try {
      const { pagination, filters } = data;

      console.log('data: ', data);
      const apiRequestParams = {
        filters: {
          keyword: filters.keyword ? filters.keyword : undefined
        },
        per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      console.log('apiRequestParams: ', apiRequestParams);
      const endPoint = apiConfig.endPoints.ROLES.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiRequestParams
      });
      return response;
    } catch (error) {
      console.log('Error from role Permission List', error);
    }
  },
  rolePermissionList: async () => {
    try {
      const endPoint = apiConfig.endPoints.ROLES.PERMISSION_LIST;
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
      console.log('Error from role Permission List', error);
    }
  },
  roleSubmit: async (data) => {
    try {
      const reqData = {
        roleName: data.roleName,
        permissionID: data.permissionsIdList
      };
      const endPoint = apiConfig.endPoints.ROLES.SUBMIT;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqData
      });
      return response;
    } catch (error) {
      console.log('Error from Submit role permission', error);
    }
  },
  roleDetail: async (rolePermissionId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.ROLES.DETAIL,
        ':rolePermissionId',
        rolePermissionId
      );
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
      console.log('Error from role detail permission', error);
    }
  },
  roleEdit: async (data) => {
    try {
      const reqData = {
        roleName: data.roleName,
        permissionID: data.permissionsIdList,
        rolePermissionID: data.rolePermissionID
      };
      const endPoint = apiConfig.endPoints.ROLES.EDIT;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqData
      });
      return response;
    } catch (error) {
      console.log('Error from Edit role permission', error);
    }
  },
  deleteRole: async (rolePermissionId) => {
    try {
      const reqData = {
        rolePermissionID: rolePermissionId
      };
      const endPoint = apiConfig.endPoints.ROLES.DELETE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqData
      });
      return response;
    } catch (error) {
      console.log('Error from Edit role permission', error);
    }
  }
};

export default RoleService;
