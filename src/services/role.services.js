import { replaceText } from 'utils/custom.utilities';
import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
const RoleService = {
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
  }
};

export default RoleService;
