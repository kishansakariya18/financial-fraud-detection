import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';

const DashboardService = {
  getDashboard: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.LIST}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getDashboard: ', err);
    }
  },

  getCardsFromUser: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.USER_CARDS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getCardsFromUser: ', err);
    }
  },

  getCardsFromGame: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.GAME_CARDS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getCardsFromGame: ', err);
    }
  },

  getCardsFromWallet: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.WALLET_CARDS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getCardsFromWallet: ', err);
    }
  },

  getCardsFromBet: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.BET_CARDS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getCards: ', err);
    }
  },

  getDepositStats: async (filters) => {
    try {
      const startDate = dayjs(filters?.startDate).format('YYYY-MM-DD HH:mm:ss');
      const endDate = dayjs(filters?.endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss');

      const apiData = {
        filters: {
          startDate,
          endDate
        }
      };
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.DEPOSIT_STATS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });

      return response;
    } catch (err) {
      console.log('Error getDepositStats: ', err);
    }
  },

  getWithdrawStats: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.WITHDRAW_STATS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getWithdrawStats: ', err);
    }
  },

  getGGRReport: async (filters) => {
    try {
      const startDate = dayjs(filters?.startDate).format('YYYY-MM-DD HH:mm:ss');
      const endDate = dayjs(filters?.endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss');

      const apiData = {
        filters: {
          startDate,
          endDate
        }
      };
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.GGR_REPORT}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });

      return response;
    } catch (err) {
      console.log('Error getGGRReport: ', err);
    }
  },

  getLoggedInPlayers: async (filters) => {
    try {
      const startDate = dayjs(filters?.startDate).format('YYYY-MM-DD HH:mm:ss');
      const endDate = dayjs(filters?.endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss');

      console.log('LOGGEDIN PLAYERS - startDate: ', startDate);
      console.log('LOGGEDIN PLAYERS - endDate: ', endDate);

      const apiData = {
        filters: {
          startDate,
          endDate
        }
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.LOGGED_IN_PLAYERS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });

      return response;
    } catch (err) {
      console.log('Error getLoggedInPlayers: ', err);
    }
  },

  getActivePlayers: async (filters) => {
    try {
      const startDate = dayjs(filters?.startDate).format('YYYY-MM-DD HH:mm:ss');
      const endDate = dayjs(filters?.endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss');

      console.log('active player - startDate: ', startDate);
      console.log('active player - endDate: ', endDate);

      const apiData = {
        filters: {
          startDate,
          endDate
        }
      };
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.ACTIVE_PLAYERS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });

      return response;
    } catch (err) {
      console.log('Error getLoggedInPlayers: ', err);
    }
  },

  getDemographicReport: async (data) => {
    try {
      console.log('data', data);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.DEMOGRAPHIC_REPORT}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });

      return response;
    } catch (err) {
      console.log('Error getDemographicReport: ', err);
    }
  },

  getKPISummary: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.KPI_SUMMARY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getKPISummary: ', err);
    }
  },

  getCasinoStats: async (filters) => {
    try {
      const startDate = dayjs(filters?.startDate).format('YYYY-MM-DD HH:mm:ss');
      const endDate = dayjs(filters?.endDate)
        .hour(23)
        .minute(59)
        .second(59)
        .format('YYYY-MM-DD HH:mm:ss');

      const apiData = {
        filters: {
          startDate,
          endDate
        }
      };
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.CASINO_STATS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });

      return response;
    } catch (err) {
      console.log('Error getCasinoStats: ', err);
    }
  },

  getTopPlayers: async (data) => {
    try {
      console.log('data', data);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.TOP_PLAYERS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });

      return response;
    } catch (err) {
      console.log('Error getTopPlayers: ', err);
    }
  },

  getTopGames: async (data) => {
    try {
      console.log('data', data);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.TOP_GAMES}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });

      return response;
    } catch (err) {
      console.log('Error getTopGames: ', err);
    }
  },

  getLastDepositor: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.LAST_DEPOSITOR}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getLastDepositor: ', err);
    }
  },

  getLastWithdrawal: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.LAST_WITHDRAWAL}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getLastWithdrawal: ', err);
    }
  },

  getLastSignup: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.LAST_SIGNUP}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getLastSignup: ', err);
    }
  }
};

export default DashboardService;
