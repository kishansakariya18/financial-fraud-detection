// apiInstance.js
import axios from 'axios';
import store from '../store';
import { AuthAction } from 'store/admin-slice/AuthSlice';
import { LOCAL_STORAGE } from 'constants/app.constant';
import apiConfig from 'configs/api.config';

const apiInstance = axios.create({
  baseURL: apiConfig.baseURL.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Token = token;
  }
  config.headers['x-source-url'] = window.location.pathname;
  config.headers['time-zone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return config;
});

// Response Interceptor
apiInstance.interceptors.response.use(
  (response) => {
    return {
      status: response.status,
      response: response.data,
      error: null
    };
  },
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      store.dispatch(AuthAction.logout(response.data?.message));
      localStorage.removeItem(LOCAL_STORAGE.AUTH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
      localStorage.removeItem(LOCAL_STORAGE.IS_MASTER_ADMIN);
      localStorage.removeItem(LOCAL_STORAGE.PERMISSIONS);
    }

    return Promise.reject(response?.data?.message || error.message || 'Something went wrong!');
  }
);

export default apiInstance;
