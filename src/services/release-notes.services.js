import { replaceText } from 'utils/custom.utilities';
import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
const ReleaseNotesService = {
  releaseNotesList: async (data) => {
    try {
      const { pagination, filters } = data;

      console.log('data: ', data);
      const apiRequestParams = {
        filters: {
          keyword: filters.keyword ? filters.keyword : undefined
        },
        limit: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      console.log('apiRequestParams: ', apiRequestParams);
      const endPoint = apiConfig.endPoints.RELEASE_NOTES.LIST;
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
      console.log('Error from release notes List', error);
    }
  },
  createReleaseNotes: async (data) => {
    try {
      const reqData = {
        version: data.version,
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate
      };
      const endPoint = apiConfig.endPoints.RELEASE_NOTES.CREATE;
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
      console.log('Error from createReleaseNotes', error);
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
        roleId: data.roleId
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
  deleteReleaseNote: async (releaseNoteId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RELEASE_NOTES.DELETE,
        ':releaseNoteUID',
        releaseNoteId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from delete release note', error);
    }
  }
};

export default ReleaseNotesService;
