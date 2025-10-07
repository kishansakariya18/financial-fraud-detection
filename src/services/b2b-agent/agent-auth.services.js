import apiConfig from 'configs/api.config';
import apiInstance from 'utils/apiInstance';

const AgentAuthService = {
  login: (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      password: String(body.password)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH_AGENT.VALIDATE, requestObject);
  },

  otpVerification: (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      password: String(body.password),
      token: String(body.token),
      otp: String(body.otp)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH_AGENT.VERIFYOTP, requestObject);
  },
  valdiateResetPassword: (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      email: String(body.email)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH_AGENT.VALIDATE_RESET_PASSWORD, requestObject);
  },
  resetPassword: (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      email: String(body.email),
      token: String(body.token),
      otp: String(body.otp),
      password: String(body.password),
      confirm_password: String(body.confirmPassword)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH_AGENT.RESET_PASSWORD, requestObject);
  },
  resedOtp: async (body) => {
    const requestObject = {
      mobile: String(body.mobile),
      token: String(body.token)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH_AGENT.RESENDOTP, requestObject);
  },
  changePassword: async (body) => {
    const requestObject = {
      current_password: String(body.currentPassword),
      new_password: String(body.newPassword),
      confirm_password: String(body.confirmPassword)
    };
    return apiInstance.post(apiConfig.endPoints.AUTH_AGENT.CHANGE_PASSWORD, requestObject);
  },
  loadAdminPermissions: async () => {
    return apiInstance.get(apiConfig.endPoints.AUTH_AGENT.LOAD_ADMIN_PERMISSIONS);
  },
  logout: async () => {
    return apiInstance.get(apiConfig.endPoints.AUTH_AGENT.LOGOUT);
  }
};

export default AgentAuthService;
