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
  }
};

export default AdminDashboardService;
