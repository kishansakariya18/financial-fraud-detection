import apiConfig from 'configs/api.config';
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

  getCards: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.CARDS}`,
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

  getDepositStats: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.DEPOSIT_STATS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
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

  getGGRReport: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.GGR_REPORT}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getGGRReport: ', err);
    }
  },

  getLoggedInPlayers: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.LOGGED_IN_PLAYERS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error getLoggedInPlayers: ', err);
    }
  },

  getActivePlayers: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.ACTIVE_PLAYERS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
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

  getCasinoStats: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DASHBOARD.CASINO_STATS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
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
  }
};

export default DashboardService;
