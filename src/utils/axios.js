import axios from 'axios';
import store from '../store';
import { LOCAL_STORAGE } from 'constants/app.constant';
import { AuthAction } from 'store/admin-slice/AuthSlice';
// import { toast } from 'sonner';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Token = `${token}`;
  }
  config.headers['time-zone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return config;
});

export const sendRequest = async (config) => {
  const result = {
    status: '',
    response: '',
    error: null
  };
  const {
    method = 'GET',
    params = {},
    headers = {},
    body = {},
    url,
    contentType = 'json'
  } = config;
  try {
    const response = await axios.request({
      url,
      method,
      params,
      headers,
      data: body ? (contentType === 'form-data' ? body : JSON.stringify(body)) : {}
    });

    result.status = response.status;
    result.response = response.data;
  } catch (err) {
    result.status = err.response.status;
    result.response = err.response.data;
    result.error = err.response.data.message || err.message || 'Something went wrong!';
  }

  if (result.status == 401) {
    store.dispatch(AuthAction.logout(result.response.message));
    localStorage.removeItem(LOCAL_STORAGE.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE.IS_MASTER_ADMIN);
    localStorage.removeItem(LOCAL_STORAGE.PERMISSIONS);
    // if (isLoggedIn) {
    //   toast.error(result.response.message, config.TOAST_UI);
    // }
  }
  return result;
};
