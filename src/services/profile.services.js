import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const ProfileService = {
  changePassword: async (data) => {
    try {
      const { currentPassword, newPassword, verifyPassword } = data;
      // const currentPassword = String(req.body.current_password);
      // const newPassword = String(req.body.new_password);
      // const confirmPassword = String(req.body.confirm_password);

      const apiData = {
        currentPassword,
        newPassword,
        confirmPassword: verifyPassword
      };
      const endPoint = apiConfig.endPoints.AUTH.CHANGE_PASSWORD;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changePlayerFundPassword: async (data) => {
    try {
      const { currentPassword, newPassword, verifyPassword } = data;

      const apiData = {
        currentPassword,
        newPassword,
        confirmPassword: verifyPassword
      };
      const endPoint = apiConfig.endPoints.USER.CHANE_PLAYER_FUND_PASSWORD;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changeAffiliateFundPassword: async (data) => {
    try {
      const { currentPassword, newPassword, verifyPassword } = data;
      // const currentPassword = String(req.body.current_password);
      // const newPassword = String(req.body.new_password);
      // const confirmPassword = String(req.body.confirm_password);

      const apiData = {
        currentPassword,
        newPassword,
        confirmPassword: verifyPassword
      };
      const endPoint = apiConfig.endPoints.AFFILIATE.CHANGE_AFFILIATE_FUND_PASSWORD;
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiData
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  updateProfile: async (data, file) => {
    try {
      const formData = new FormData();

      if (file && file.name) {
        formData.append('image', file, file.name);
      }

      formData.append('username', data.userName);
      formData.append('firstname', data.firstName);
      formData.append('lastname', data.lastName);
      formData.append('email', data.email);
      formData.append('mobile', data.mobile);

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.ADMIN_USER.UPDATE_PROFILE,
        method: 'POST',
        headers: {
          'Content-Type': "multipart/form-data'"
        },
        body: formData,
        contentType: 'form-data'
      });
      return response;
    } catch (error) {
      console.log('error in update profile: ', error);
    }
  }
};

export default ProfileService;
