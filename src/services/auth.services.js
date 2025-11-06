import apiConfig from 'configs/api.config';
import apiInstance from 'utils/apiInstance';

const AuthService = {
  login: async (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      password: String(body.password)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH.VALIDATE, requestObject);
  },
  otpVerification: async (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      password: String(body.password),
      token: String(body.token),
      otp: String(body.otp)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH.VERIFYOTP, requestObject);
  },
  valdiateResetPassword: async (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      email: String(body.email)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH.VALIDATE_RESET_PASSWORD, requestObject);
  },
  resetPassword: async (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      email: String(body.email),
      token: String(body.token),
      otp: String(body.otp),
      password: String(body.password),
      confirm_password: String(body.confirmPassword)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH.RESET_PASSWORD, requestObject);
  },
  resedOtp: async (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      token: String(body.token)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH.RESENDOTP, requestObject);
  },
  changePassword: async (body) => {
    const requestObject = {
      current_password: String(body.currentPassword),
      new_password: String(body.newPassword),
      confirm_password: String(body.confirmPassword)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH.CHANGE_PASSWORD, requestObject);
  },
  loadInitialSettings: async () => {
    return apiInstance.get(apiConfig.endPoints.ADMIN_USER.ADMIN_APPSETTINGS);
  },
  loadAdminPermissions: async () => {
    return apiInstance.get(apiConfig.endPoints.ADMIN_USER.ADMIN_PERMISSION);
  },
  getCountries: async () => {
    return apiInstance.get(apiConfig.endPoints.ADMIN_USER.COUNTRY_LIST);
  },
  logout: () => {
    return apiInstance.get(apiConfig.endPoints.AUTH.LOGOUT);
  }
};

export default AuthService;
