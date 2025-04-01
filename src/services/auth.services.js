import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const AuthService = {
  login: async (body) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AUTH.VALIDATE}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          mobile: String(body.mobile),
          password: String(body.password)
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  otpVerification: async (body) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AUTH.VERIFYOTP}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          mobile: String(body.mobile),
          password: String(body.password),
          token: String(body.token),
          otp: String(body.otp)
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  valdiateResetPassword: async (body) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AUTH.VALIDATE_RESET_PASSWORD}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          mobile: String(body.mobile),
          email: String(body.email)
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  resetPassword: async (body) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AUTH.RESET_PASSWORD}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          mobile: String(body.mobile),
          email: String(body.email),
          token: String(body.token),
          otp: String(body.otp),
          password: String(body.password),
          confirm_password: String(body.confirmPassword)
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  resedOtp: async (body) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AUTH.RESENDOTP}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          mobile: String(body.mobile),
          token: String(body.token)
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changePassword: async (body) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.REACT_APP_API_URL}${apiConfig.endPoints.AUTH.CHANGE_PASSWORD}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          current_password: String(body.currentPassword),
          new_password: String(body.newPassword),
          confirm_password: String(body.confirmPassword)
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  loadInitialSettings: async () => {
    try {
      const endPoint = apiConfig.endPoints.ADMIN_USER.ADMIN_APPSETTINGS;
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
  loadAdminPermissions: async () => {
    try {
      const endPoint = apiConfig.endPoints.ADMIN_USER.ADMIN_PERMISSION;
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
  getCountries: async () => {
    try {
      let apiURL = `${apiConfig.baseURL.REACT_APP_API_URL}${apiConfig.endPoints.ADMIN_USER.ADMIN_COUNTRY_LIST}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error getCountries: ', err);
    }
  },
};

export default AuthService;
