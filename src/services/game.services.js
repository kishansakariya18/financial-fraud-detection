import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const GameService = {
  getGameList: async (body) => {
    try {
      const { perPage, currentPage, filters, isPaginationRequired = true } = body;
      console.log('filters: ', filters);

      const { status, keyword, startDate, endDate, providerId, categoryId } = filters;

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
        categoryId: categoryId
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.GAME.LIST}`,
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
  createGame: async (data, file) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('categoryId', data.categoryId);
      formData.append('providerId', data.providerId);

      if (file && file.name) {
        formData.append('image', file, file.name);
      }

      const response = await sendRequest({
        url: apiConfig.baseURL.REACT_APP_API_URL + apiConfig.endPoints.GAME.CREATE,
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
  editGame: async (gameId, data, file) => {
    try {
      const endPoints = replaceText(apiConfig.endPoints.GAME.EDIT, ':gameId', gameId);

      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('categoryId', data.categoryId);
      formData.append('minBetAmount', data.minBetAmount);
      formData.append('maxBetAmount', data.maxBetAmount);

      if (file && file.name) {
        formData.append('image', file, file.name);
      }

      const response = await sendRequest({
        url: apiConfig.baseURL.REACT_APP_API_URL + endPoints,
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
  changeGameStatus: async (gameId) => {
    try {
      const endpoint = replaceText(apiConfig.endPoints.GAME.CHANGE_STATUS, ':gameId', gameId);

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endpoint,
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
  deleteGame: async (gameId) => {
    try {
      const endpoint = replaceText(apiConfig.endPoints.GAME.DELETE, ':gameId', gameId);

      const response = await sendRequest({
        url: apiConfig.baseURL.REACT_APP_API_URL + endpoint,
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
  getProviderList: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.REACT_APP_API_URL}${apiConfig.endPoints.GAME.PROVIDER_LIST}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error game getProviderList: ', err);
    }
  },
  getCategoryList: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.REACT_APP_API_URL}${apiConfig.endPoints.GAME.CATEGORY_LIST}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error game getCategoryList: ', err);
    }
  }
};

export default GameService;
