import { parseCategoryStatusToApi } from 'app/pages/casino-management/category/helper';
import apiConfig from 'configs/api.config';
import { getEndDate, getStartDate } from 'helpers/functions';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const CategoryService = {
  getCategoryList: async (body) => {
    try {
      const { pagination, filters, isPaginationRequired = true } = body;

      const { status, keyword, startDate, endDate } = filters;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        status: status ? parseCategoryStatusToApi(status) : undefined,
        keyword: keyword || undefined,
        startDate: startDate ? getStartDate(startDate) : undefined,
        endDate: endDate ? getEndDate(endDate) : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.CATEGORY.LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams, isPaginationRequired },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  createCategory: async (data, file) => {
    try {
      const formData = new FormData();

      if (file && file.name) {
        formData.append('image', file, file.name);
      }
      formData.append('name', data?.name ? data.name : undefined);
      const apiBody = formData;

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.CATEGORY.CREATE,
        method: 'POST',
        body: apiBody,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        contentType: 'form-data'
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getCategorySummary: async () => {
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.CATEGORY.SUMMARY,
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
  editCategory: async (id, data, file) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.CATEGORY.EDIT, ':categoryId', id);
      const formData = new FormData();
      if (file && file.name) {
        formData.append('image', file, file.name);
      }
      formData.append('name', data?.name ? data.name : undefined);
      const apiBody = formData;

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'PUT',
        body: apiBody,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        contentType: 'form-data'
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  deleteCategory: async (id) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.CATEGORY.DELETE, ':categoryId', id);

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
  changeCategoryStatus: async (id) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.CATEGORY.CHANGE_STATUS, ':categoryId', id);

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
  getAllActiveCategories: async (body) => {
    try {
      const { pagination, isPaginationRequired = false, filters } = body;

      const apiQueryParams = {
        perPage: pagination?.pageSize || 10,
        page: (pagination?.pageIndex || 0) + 1
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.CATEGORY.ALL_ACTIVE_LIST,
        method: 'POST',
        body: { isPaginationRequired, filters },
        headers: {
          'Content-Type': 'application/json'
        },
        params: isPaginationRequired ? apiQueryParams : {}
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getCategoryByProviderIds: async (providerIds) => {
    try {
      const response = await sendRequest({
        url:
          apiConfig.baseURL.API_BASE_URL +
          apiConfig.endPoints.CATEGORY.GET_CATEGORY_BY_PROVIDER_IDS,
        method: 'POST',
        body: { providerIds },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getCategoryGamesList: async (categoryId, state) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.CATEGORY.CATEGORY_GAMES_LIST,
        ':categoryId',
        categoryId
      );

      const { pagination, filters, isPaginationRequired = 1 } = state || {};

      const apiQueryParams = {
        perPage: pagination ? pagination.pageSize : (state?.perPage ?? 10),
        page: pagination ? pagination.pageIndex + 1 : (state?.page ?? 1)
      };

      const apiBody = {
        isPaginationRequired,
        filters: {
          keyword: filters?.keyword || undefined
        }
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${endPoint}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        params: apiQueryParams,
        body: apiBody
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  gamesList: async (categoryId, state) => {
    try {
      const { pagination, filters, isPaginationRequired = true } = state;
      const perPage = pagination?.pageSize;
      const currentPage = (pagination?.pageIndex || 0) + 1;

      console.log('filters: ', filters);

      const {
        status,
        keyword,
        startDate,
        endDate,
        providerId,
        categoryId: filterCategoryId
      } = filters || {};

      const apiQueryParams = {
        perPage,
        page: currentPage
      };

      const apiRequestParams = {
        status: status,
        keyword: keyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        providerId: providerId,
        categoryId: filterCategoryId
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.GAME.LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams, isPaginationRequired, excludedCategoryId: categoryId },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  addCategoryGames: async (categoryId, gameIds) => {
    try {
      const apiBody = {
        gameIds
      };
      const endPoints = replaceText(
        apiConfig.endPoints.CATEGORY.ADD_GAMES,
        ':categoryId',
        categoryId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoints,
        method: 'POST',
        body: apiBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('error', error);
    }
  },
  removeCategoryGames: async (categoryId, gameIds) => {
    try {
      const apiBody = {
        gameIds
      };
      const endPoints = replaceText(
        apiConfig.endPoints.CATEGORY.REMOVE_GAMES,
        ':categoryId',
        categoryId
      );

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoints,
        method: 'POST',
        body: apiBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('error', error);
    }
  }
};

export default CategoryService;
