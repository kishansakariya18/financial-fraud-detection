import { replaceText } from 'utils/custom.utilities';
import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
const ReleaseNotesService = {
  releaseNotesList: async (data) => {
    try {
      const { pagination, filters } = data;

      // console.log('data: ', data);
      const apiRequestParams = {
        keyword: filters.keyword ? filters.keyword : undefined,
        status: filters.status ? filters.status : undefined,
        limit: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      // console.log('apiRequestParams: ', apiRequestParams);
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
  releaseNoteDetails: async (releaseNoteId) => {
    try {
      // console.log('Original endpoint:', apiConfig.endPoints.RELEASE_NOTES.DETAIL);
      const endPoint = replaceText(
        apiConfig.endPoints.RELEASE_NOTES.DETAIL,
        ':releaseNoteUID',
        releaseNoteId
      );
      // console.log('Processed endpoint:', endPoint);
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
      console.log('Error from release note details', error);
    }
  },
  releaseNoteEdit: async (data, releaseNoteId) => {
    try {
      const reqData = {
        version: data.version,
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate
      };
      const endPoint = replaceText(
        apiConfig.endPoints.RELEASE_NOTES.EDIT,
        ':releaseNoteUID',
        releaseNoteId
      );
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
  },
  changeStatus: async (releaseNoteId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RELEASE_NOTES.CHANGE_STATUS,
        ':releaseNoteUID',
        releaseNoteId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from changeStatus release notes', error);
    }
  }
};

export default ReleaseNotesService;
