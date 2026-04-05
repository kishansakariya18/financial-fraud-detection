import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const { ANALYTICS } = apiConfig.endPoints;

function analyticsUrl(path) {
  return apiConfig.baseURL.API_BASE_URL + path;
}

function buildQuery(params = {}) {
  const q = {};
  if (params.startDate) q.startDate = params.startDate;
  if (params.endDate) q.endDate = params.endDate;
  if (params.granularity) q.granularity = params.granularity;
  return q;
}

const AnalyticsService = {
  getIncomeVsExpense: async (params) => {
    return sendRequest({
      url: analyticsUrl(ANALYTICS.INCOME_VS_EXPENSE),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: buildQuery(params)
    });
  },

  getTransactions: async (params) => {
    return sendRequest({
      url: analyticsUrl(ANALYTICS.TRANSACTIONS),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: buildQuery(params)
    });
  },

  getFraud: async (params) => {
    return sendRequest({
      url: analyticsUrl(ANALYTICS.FRAUD),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: buildQuery(params)
    });
  },

  getDashboard: async (params) => {
    return sendRequest({
      url: analyticsUrl(ANALYTICS.DASHBOARD),
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: buildQuery(params)
    });
  },

  generateReport: async (body) => {
    return sendRequest({
      url: analyticsUrl(ANALYTICS.REPORT),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body || {}
    });
  }
};

export default AnalyticsService;
