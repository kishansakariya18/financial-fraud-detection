import { parseProviderStatusToApi } from 'app/pages/casino-management/provider/helper';
import { parseHomeGameStatusToApi } from 'app/pages/frontend/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const HomePageService = {
  getHomeCategories: async (body) => {
    try {
      const { pagination, filters } = body;

      const { status, keyword } = filters;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        status: status ? parseProviderStatusToApi(status) : undefined,
        keyword: keyword || undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.HOME_CATEGORY_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changeHomeCategoryStatus: async (homeCategoryId) => {
    try {
      const endpoint = replaceText(
        apiConfig.endPoints.HOME_PAGE.CHANGE_HOME_CATEGORY_STATUS,
        ':homeCategoryId',
        homeCategoryId
      );

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${endpoint}`,
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
  deleteHomeCategory: async (homeCategoryId) => {
    try {
      const endpoint = apiConfig.endPoints.HOME_PAGE.DELETE_THEME;

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${endpoint}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: { appearanceId: homeCategoryId }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changeHomeGameStatus: async (homePageGameId) => {
    try {
      const endpoint = replaceText(
        apiConfig.endPoints.HOME_PAGE.CHANGE_HOME_GAME_STATUS,
        ':homePageGameId',
        homePageGameId
      );

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${endpoint}`,
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
  deleteHomeGame: async (homePageGameId) => {
    try {
      console.log('homePageGameId ::>>> ', homePageGameId);

      const endpoint = replaceText(
        apiConfig.endPoints.HOME_PAGE.DELETE_HOME_GAME,
        ':homePageGameId',
        homePageGameId
      );

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${endpoint}`,
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
  getCategories: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.GET_CATEGORY}`,
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
  editHomeCategory: async (body) => {
    try {
      const { categoryId, homeCategoryId } = body;
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.EDIT_HOME_CATEGORY}`,
        method: 'POST',
        body: {
          categoryId,
          homeCategoryId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getHomeGames: async (body) => {
    try {
      const { homeCategoryId, pagination, filters } = body;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const { status, keyword } = filters;

      const apiFilters = {
        status: status ? parseHomeGameStatusToApi(status) : undefined,
        keyword: keyword || undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.HOME_GAME_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          homeCategoryId,
          filters: apiFilters
        },
        params: apiQueryParams
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  getAddHomeGameList: async (body) => {
    try {
      const { homeCategoryId, pagination, filters } = body;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      const { status, keyword } = filters;

      const apiFilters = {
        status: status ? parseHomeGameStatusToApi(status) : undefined,
        keyword: keyword || undefined
      };
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.ADD_HOME_GAME_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          homeCategoryId,
          filters: apiFilters
        },
        params: apiQueryParams
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  addHomeGame: async (body) => {
    try {
      const { homeCategoryId, gameIds } = body;

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.ADD_HOME_GAMES}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          homeCategoryId,
          gameIds
        }
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  reorderCategory: async (body) => {
    try {
      const { updatedCategories } = body;

      console.log('updatedCategories: ', updatedCategories);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.REORDER_CATEGORY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          updatedCategoryOrderList: updatedCategories
        }
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  reorderGames: async (body) => {
    try {
      const { updatedGames } = body;

      console.log('updatedCategories: ', updatedGames);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.REORDER_GAMES}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          updatedGameOrderList: updatedGames
        }
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  addAppearance: async (body) => {
    try {
      const { name, primaryColor, secondaryColor, fontColor1, fontColor2, fontColor3, fontColor4 } =
        body;

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.ADD_APPEARANCE}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          name,
          primaryColor,
          secondaryColor,
          fontColor1,
          fontColor2,
          fontColor3,
          fontColor4
        }
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  changeAppearanceStatus: async (body) => {
    try {
      const { appearanceId, status } = body;

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.CHANGE_APPEARANCE_STATUS}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          appearanceId,
          status: status === 'active' ? 0 : 1
        }
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  appearanceList: async (data) => {
    try {
      const { pagination } = data;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.HOME_PAGE.APPEARANCE_LIST}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: apiQueryParams
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  }
};

export default HomePageService;
