import { pagesStatusToAPI } from 'app/pages/pages/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const PagesService = {
  pagesList: async (data) => {
    try {
      const { filters, pagination } = data;
      const reqBody = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        keyword: filters?.keyword || undefined,
        status: filters?.status ? pagesStatusToAPI(filters.status) : undefined,
        ...(!pagination && { pagination: false })
      };
      const endPoint = apiConfig.endPoints.PAGE.LIST;
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
      console.log('Error from Page List', error);
    }
  },
  pagesAdd: async (data) => {
    try {
      const reqBody = {
        name: data.name,
        content: data.content,
        status: pagesStatusToAPI(data.status)
      };
      const endPoint = apiConfig.endPoints.PAGE.ADD;
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
      console.log('Error from add new page', error);
    }
  },
  pagesUpdate: async (data) => {
    try {
      const reqBody = {
        pageID: data.pageID,
        name: data.name,
        content: data.content,
        status: pagesStatusToAPI(data.status)
      };
      const endPoint = apiConfig.endPoints.PAGE.UPDATE;
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
      console.log('Error from update page', error);
    }
  },
  pagesDetail: async (pageID) => {
    try {
      const reqBody = {
        pageID
      };
      const endPoint = apiConfig.endPoints.PAGE.DETAIL;
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
      console.log('Error from page detail', error);
    }
  },
  pagesDelete: async (pageID) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.PAGE.DELETE, ':pageID', pageID);
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from delete page', error);
    }
  },
  pagesChangeStatus: async (pageID) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.PAGE.TOGGLE_STATUS, ':pageID', pageID);
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
      console.log('Error from change page status', error);
    }
  }
};

export default PagesService;
