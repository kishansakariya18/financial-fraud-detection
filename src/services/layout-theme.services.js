import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { replaceText } from 'utils/custom.utilities';

const LayoutThemeService = {
  layoutList: async (data) => {
    try {
      const { pagination, filters } = data;
      const apiRequestParams = {
        filter: {
          keyword: filters.keyword ? filters.keyword : undefined,
          status: filters.status ? filters.status : undefined
        },
        limit: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      const endPoint = apiConfig.endPoints.LAYOUT_THEME.VIEW;
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
      console.log('Error from email provider list', error);
    }
  },
  createLayoutTheme: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.LAYOUT_THEME.CREATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error from create layout theme', error);
    }
  },
  changeLayoutThemeStatus: async (layoutThemeID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.LAYOUT_THEME.STATUS,
        ':layoutThemeID',
        layoutThemeID
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
      console.log('Error from provider status', error);
    }
  },
  getLayoutDetail: async (layoutThemeID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.LAYOUT_THEME.DETAIL,
        ':layoutThemeID',
        layoutThemeID
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
      console.log('Error from provider status', error);
    }
  },
  getLayoutList: async () => {
    try {
      const endPoint = apiConfig.endPoints.LAYOUT_THEME.LAYOUT_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.log('Error from get provider details', error);
    }
  },
  updateProvider: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.LAYOUT_THEME.EDIT;

      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error from update provider', error);
    }
  }
};

export default LayoutThemeService;
