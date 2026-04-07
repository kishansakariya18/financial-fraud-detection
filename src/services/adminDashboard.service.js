import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const AdminDashboardService = {
  getDashboard: async (params = {}) => {
    const endPoint = apiConfig.endPoints.ADMIN_FRAUD.DASHBOARD;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
    const q = {};
    if (params.startDate) q.startDate = params.startDate;
    if (params.endDate) q.endDate = params.endDate;
    return sendRequest({
      url: apiURL,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: q
    });
  },

  /** GET /admin/users?page=&limit= */
  getUsers: async (params = {}) => {
    const endPoint = apiConfig.endPoints.ADMIN_FRAUD.USERS;
    const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
    return sendRequest({
      url: apiURL,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20
      }
    });
  },

  /** GET /admin/users/:id */
  getUserById: async (userId) => {
    const base = apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.ADMIN_FRAUD.USERS;
    const apiURL = `${base}/${userId}`;
    return sendRequest({
      url: apiURL,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default AdminDashboardService;
