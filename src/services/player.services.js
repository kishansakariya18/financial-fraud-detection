// import { replaceText } from '../helpers/functions';

import {
  fundTypeToAPI,
  playerStatusToAPI,
  transactionStatusToAPI,
  transactionTypeAppToApi,
  txnTypeToAPI
} from 'app/pages/users/player/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';
import { ConvertDateIntoUTC, replaceText } from 'utils/custom.utilities';

const PlayerService = {
  playerList: async (data) => {
    try {
      const { pagination, filters } = data;
      const apiRequestParams = {
        keyword: filters.keyword ? filters.keyword : undefined,
        status: filters.status ? playerStatusToAPI(filters.status) : undefined,
        startDate: filters.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        endDate: filters.endDate
          ? dayjs(+filters.endDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        limit: pagination?.pageSize || 10,
        page: pagination.pageIndex + 1
      };
      const endPoint = apiConfig.endPoints.USER.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiRequestParams
      });
      return response;
    } catch (error) {
      console.log('Error from user list', error);
    }
  },
  userReferralList: async (data) => {
    try {
      const reqBody = {
        page: +data.currentPage,
        limit: +data.perPage
      };
      const endPoint = replaceText(apiConfig.endPoints.USER.REFERRAL_LIST, ':userID', data.userID);
      const apiURL = apiConfig.baseURL.REACT_APP_API_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqBody
      });
      return response;
    } catch (error) {
      console.log('Error from user referral list', error);
    }
  },
  managePlayerFund: async (data) => {
    try {
      const requestBody = {
        amount: data.amount,
        userID: data.playerId,
        amountType: fundTypeToAPI(data.fundType),
        type: transactionTypeAppToApi(data.type),
        fundMessage: data.fundMessage,
        password: data.password
      };
      const endPoint = apiConfig.endPoints.USER.FUND;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });
      return response;
    } catch (error) {
      console.log('Error from userFund', error);
    }
  },
  playerTransactions: async (data) => {
    try {
      const { pagination, filters, playerId } = data;
      const query = {
        page: pagination.pageIndex + 1,
        perPage: pagination?.pageSize
      };
      const body = {
        userID: playerId,
        filters: {
          keyword: filters?.keyword || undefined,
          endDate: ConvertDateIntoUTC(filters?.endDate) || undefined,
          startDate: ConvertDateIntoUTC(filters?.startDate) || undefined,
          status: filters.status ? transactionStatusToAPI(filters.status) : undefined,
          type: filters?.type ? transactionTypeAppToApi(filters.type) : undefined,
          transactionType: filters?.transactionType
            ? txnTypeToAPI(filters.transactionType)
            : undefined
        }
      };
      const endPoint = apiConfig.endPoints.USER.TRANSACTION_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from userTransactionList', error);
    }
  },
  userBetTransactionList: async (reqBody) => {
    try {
      const query = {
        page: +reqBody.currentPage,
        perPage: +reqBody.perPage
      };
      const body = {
        userID: reqBody.userID,
        filters: {
          keyword: reqBody?.filters?.keyword,
          endDate: reqBody?.filters?.endDate
            ? ConvertDateIntoUTC(reqBody?.filters?.endDate + ' 23:59:59')
            : '',
          startDate: '',
          type: reqBody?.filters?.type
        },
        partialFilters: {
          type: reqBody.activePartialTransactionType
        }
      };
      const endPoint = apiConfig.endPoints.USER.TRANSACTION_LIST;
      const apiURL = apiConfig.baseURL.REACT_APP_API_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from userTransactionList', error);
    }
  },
  userTdsSummaryTransactionList: async (reqBody) => {
    try {
      const query = {
        page: +reqBody.currentPage,
        perPage: +reqBody.perPage
      };
      const body = {
        userID: reqBody.userID,
        filters: {
          keyword: reqBody?.filters?.keyword,
          endDate: reqBody?.filters?.endDate
            ? ConvertDateIntoUTC(reqBody?.filters?.endDate + ' 23:59:59')
            : '',
          startDate: ConvertDateIntoUTC(reqBody?.filters?.startDate)
        },
        partialFilters: {
          type: reqBody.activePartialTransactionType
        }
      };
      const endPoint = apiConfig.endPoints.USER.TDS_SUMMARY_TRANSACTION_LIST;
      const apiURL = apiConfig.baseURL.REACT_APP_API_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from userTransactionList', error);
    }
  },
  changePlayerStatus: async (userID) => {
    try {
      const body = {
        userID
      };
      const endPoint = apiConfig.endPoints.USER.CHANGE_STATUS;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });
      return response;
    } catch (error) {
      console.log('Error from userStatus', error);
    }
  },
  userRestBankCount: async (userID) => {
    try {
      const body = {
        userID
      };
      const endPoint = apiConfig.endPoints.USER.REST_BANK_COUNT;
      const apiURL = apiConfig.baseURL.REACT_APP_API_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });
      return response;
    } catch (error) {
      console.log('Error from userRestBankCount', error);
    }
  },
  userDetail: async (userID) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.USER.DETAIL, ':userID', userID);
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
      console.log('Error from user referral list', error);
    }
  },
  playerTransactionDetail: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.USER.TRANSACTION_DETAIL;
      console.log('data::', data);
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          transactionId: data.transactionId,
          db: data.db
        }
      });
      return response;
    } catch (error) {
      console.log('Error from user referral list', error);
    }
  },
  updateRiskManagementFields: async (data, userID) => {
    try {
      console.log('data; ', data);
      const apiBodyData = {
        HasDailyBetWageLimit: data.hasDailyWagerLimit,
        HasWeeklyBetWageLimit: data.hasWeeklyWagerLimit,
        HasMonthlyBetWageLimit: data.hasMonthlyWagerLimit,
        HasMaxDepositPerDayLimit: data.hasDailyDepositLimit,
        HasMaxDepositPerWeekLimit: data.hasWeeklyDepositLimit,
        HasMaxDepositPerMonthLimit: data.hasMonthlyDepositLimit,
        HasMaxWithdrawPerDayLimit: data.hasDailyWithdrawLimit,
        HasMaxWithdrawPerWeekLimit: data.hasWeeklyWithdrawLimit,
        HasMaxWithdrawPerMonthLimit: data.hasMonthlyWithdrawLimit,
        HasDailyLossLimit: data.hasDailyLossLimit,
        HasWeeklyLossLimit: data.hasWeeklyLossLimit,
        HasMonthlyLossLimit: data.hasMonthlyLossLimit,

        BetDailyWageLimit: data?.dailyWagerLimit || undefined,
        BetWeeklyWageLimit: data?.weeklyWagerLimit || undefined,
        BetMonthlyWageLimit: data?.monthlyWagerLimit || undefined,
        MaxDepositPerDay: data?.dailyDepositLimit || undefined,
        MaxDepositPerWeek: data?.weeklyDepositLimit || undefined,
        MaxDepositPerMonth: data?.monthlyDepositLimit || undefined,
        MaxWithdrawPerDay: data?.dailyWithdrawLimit || undefined,
        MaxWithdrawPerWeek: data?.weeklyWithdrawLimit || undefined,
        MaxWithdrawPerMonth: data?.monthlyWithdrawLimit || undefined,
        DailyLossLimit: data?.dailyLossLimit || undefined,
        WeeklyLossLimit: data?.weeklyLossLimit || undefined,
        MonthlyLossLimit: data?.monthlyLossLimit || undefined,
        ExclusionType: data?.selfExclusionType || undefined,
        ExclusionStartAt: ConvertDateIntoUTC(data?.exclusionStartAt) || undefined,
        ExclusionEndAt: ConvertDateIntoUTC(data?.exclusionEndAt) || undefined
      };

      const endPoint = replaceText(
        apiConfig.endPoints.USER.UPDATE_RISK_MANAGEMENT,
        ':userID',
        userID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiBodyData
      });
      return response;
    } catch (error) {
      console.log('Error from Risk management Update', error);
    }
  },
  getAllUserTransactionList: async (reqBody) => {
    try {
      const query = {
        page: +reqBody.currentPage,
        perPage: +reqBody.perPage
      };
      const body = {
        filters: {
          keyword: reqBody?.filters?.keyword,
          endDate: reqBody?.filters?.endDate
            ? ConvertDateIntoUTC(reqBody?.filters?.endDate + ' 23:59:59')
            : '',
          startDate: ConvertDateIntoUTC(reqBody?.filters?.startDate),
          // type: reqBody?.filters?.type
          transactionType: +reqBody?.filters.transactionType
        }
      };
      const endPoint = apiConfig.endPoints.USER.ALL_TRANSACTION_LIST;
      const apiURL = apiConfig.baseURL.REACT_APP_API_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from userTransactionList', error);
    }
  },
  getNoteDetails: async (commentID) => {
    try {
      const query = {
        commentID
      };

      const endPoint = apiConfig.endPoints.USER.GET_COMMENT_DETAIL;
      const apiURL = apiConfig.baseURL.REACT_APP_API_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from getCommentDetail', error);
    }
  },
  getPlayerNotes: async (data) => {
    try {
      const { pagination, playerId } = data;
      const query = {
        userID: playerId,
        perPage: pagination?.pageSize,
        page: pagination.pageIndex + 1
      };

      const endPoint = apiConfig.endPoints.USER.GET_COMMENT;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from getComment', error);
    }
  },
  deletePlayerNote: async (playerId) => {
    try {
      const query = {
        commentID: playerId
      };

      const endPoint = apiConfig.endPoints.USER.DELETE_COMMENT;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from deleteComment', error);
    }
  },
  editPlayerNote: async (data) => {
    try {
      const apiBodyData = {
        commentID: data.noteId,
        isPinned: data.isPinned,
        comment: data.note
      };
      const endPoint = apiConfig.endPoints.USER.UPDATE_COMMENT;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiBodyData
      });
      return response;
    } catch (error) {
      console.log('Error from updateComment', error);
    }
  },

  getPlayerLoginHistory: async (data) => {
    try {
      const { pagination, playerId } = data;
      const query = {
        page: pagination.pageIndex + 1,
        perPage: pagination?.pageSize
      };
      const endPoint = replaceText(apiConfig.endPoints.USER.LOGIN_HISTORY, ':userID', playerId);
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: query
      });
      return response;
    } catch (error) {
      console.log('Error from userLoginHistory', error);
    }
  },
  addPlayerNote: async (data) => {
    try {
      const reqBody = {
        userID: data.playerId,
        comment: data.note,
        isPinned: data.isPinned
      };
      const endPoint = apiConfig.endPoints.USER.ADD_COMMENT;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqBody
      });
      return response;
    } catch (error) {
      console.log('Error from AddComment', error);
    }
  }
};

export default PlayerService;
