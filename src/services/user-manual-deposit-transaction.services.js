import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { replaceText } from 'utils/custom.utilities';
import dayjs from 'dayjs';

const UserManualDepositTransactionService = {
  getUserManualDepositTransactionList: async ({
    pagination,
    keyword,
    status,
    startDate,
    endDate
  }) => {
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
          status: status,
          ...(startDate && endDate
            ? {
                startDate: `${dayjs(Number(startDate)).format('YYYY-MM-DD')} 00:00:00`,
                endDate: `${dayjs(Number(endDate)).format('YYYY-MM-DD')} 23:59:59`
              }
            : {})
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
  },
  manualVerify: async (data) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER_MANUAL_DEPOSIT_TRANSACTION.MANUAL_VERIFY,
        ':depositId',
        data.id
      );
      //const endPoint = apiConfig.endPoints.USER_MANUAL_DEPOSIT_TRANSACTION.MANUAL_VERIFY;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          depositStatus: data.depositStatus,
          rejectionReason: data.rejectionReason
        }
      });
      return response;
    } catch (error) {
      console.log('Error from User Manual Deposit Transaction Verify', error);
    }
  }
};

export default UserManualDepositTransactionService;
