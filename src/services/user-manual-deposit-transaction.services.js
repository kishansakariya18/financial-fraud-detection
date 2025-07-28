import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { replaceText } from 'utils/custom.utilities';

const UserManualDepositTransactionService = {
  getUserManualDepositTransactionList: async ({ pagination, keyword, status }) => {
    try {
      const endPoint = apiConfig.endPoints.USER_MANUAL_DEPOSIT_TRANSACTION.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          limit: pagination.pageSize,
          page: pagination.pageIndex + 1,
          keyword: keyword,
          status: status
        }
      });
      return response;
    } catch (error) {
      console.log('Error from User Manual Deposit Transaction List', error);
    }
  },
  updateUserManualDepositTransaction: async (data) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER_MANUAL_DEPOSIT_TRANSACTION.EDIT,
        ':depositId',
        data.id
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      });
      return response;
    } catch (error) {
      console.log('Error from User Manual Deposit Transaction Update', error);
    }
  },
  deleteUserManualDepositTransaction: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER_MANUAL_DEPOSIT_TRANSACTION.DELETE,
        ':depositId',
        id
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from User Manual Deposit Transaction Delete', error);
    }
  },
  getUserManualDepositTransactionDetail: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER_MANUAL_DEPOSIT_TRANSACTION.DETAIL,
        ':depositId',
        id
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from User Manual Deposit Transaction Detail', error);
    }
  }
};

export default UserManualDepositTransactionService;
