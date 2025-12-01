// import { replaceText } from '../helpers/functions';

import {
  fundTypeToAPI,
  playerStatusToAPI,
  transactionStatusToAPI,
  transactionTypeAppToApi,
  txnTypeToAPI,
  playerKycToAPI,
  emailVerifyOptionToAPI,
  mobileVerifyOptionToAPI
} from 'components/sections/player-management/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import apiInstance from 'utils/apiInstance';
import { sendRequest } from 'utils/axios';
import { ConvertDateIntoUTC, replaceText } from 'utils/custom.utilities';

const PlayerService = {
  playerList: async (data) => {
    try {
      const { pagination, filters } = data;
      // console.log('filters: ', filters);
      const apiRequestParams = {
        ...(data.agentUID && { agentUID: data.agentUID }),
        keyword: filters.keyword ? filters.keyword : undefined,
        isEmailVerified: filters.isEmailVerified
          ? emailVerifyOptionToAPI(filters.isEmailVerified)
          : undefined,
        isMobileVerified: filters.isMobileVerified
          ? mobileVerifyOptionToAPI(filters.isMobileVerified)
          : undefined,
        playerKYCLevel: filters.userKYCLevel ? filters.userKYCLevel : undefined,
        status: filters.status ? playerStatusToAPI(filters.status) : undefined,
        isKYCVerified: filters.isKYCVerified ? playerKycToAPI(filters.isKYCVerified) : undefined,
        isBankVerified: filters.isBankVerified ? playerKycToAPI(filters.isBankVerified) : undefined,
        gender: filters.gender ? filters.gender : undefined,
        playerClassID: filters.playerClassID ? filters.playerClassID : undefined,
        countries: filters.CountryID ? filters.CountryID.split(',') : [],
        segments: filters.SegmentationID ? filters.SegmentationID.split(',') : [],
        startDate: filters.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        endDate: filters.endDate
          ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
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
  countryList: async () => {
    try {
      const endPoint = apiConfig.endPoints.USER.COUNTRY_LIST;
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
      console.log('Error from user country list', error);
    }
  },
  segmentationList: async () => {
    try {
      const endPoint = apiConfig.endPoints.USER.SEGMENTATION_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        body: {
          pagination: false,
          filters: {}
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from user segmentation list', error);
    }
  },
  userReferralList: async (data) => {
    try {
      const { pagination, filters } = data;
      console.log('filters: ', filters);

      const apiRequestParams = {
        keyword: filters.keyword ? filters.keyword : undefined,
        startDate: filters.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        endDate: filters.endDate
          ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        limit: pagination?.pageSize || 10,
        page: pagination.pageIndex + 1
      };

      const endPoint = replaceText(
        apiConfig.endPoints.USER.REFERRAL_LIST,
        ':userID',
        data.playerId
      );
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
      console.log('Error from user referral list', error);
    }
  },
  managePlayerFund: async (data) => {
    try {
      console.log(data);
      const requestBody = {
        amount: data.amount,
        userUID: data.playerId,
        amountType: fundTypeToAPI(data.fundType),
        type: transactionTypeAppToApi(data.type),
        fundMessage: data.fundMessage,
        password: data.password,
        currencyID: data.currency
      };
      const endPoint = apiConfig.endPoints.WALLET.FUND;
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
        userUID: playerId,
        filters: {
          keyword: filters?.keyword || undefined,
          endDate: filters.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          startDate: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
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
  changePlayerStatus: async (playerId) => {
    try {
      const body = {
        userUID: playerId
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
  upgradeUserClass: async ({ nextClassID, userUID }) => {
    try {
      const endPoint = apiConfig.endPoints.USER.UPGRADE_USER_CLASS;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          nextClassID: String(nextClassID),
          userUID
        }
      });
      return response;
    } catch (error) {
      console.log('Error from upgradeUserClass', error);
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
  userDetail: async (playerId) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.USER.DETAIL, ':userUID', playerId);
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
      console.log('Error from user detail list', error);
    }
  },
  userSummary: async () => {
    try {
      const endPoint = apiConfig.endPoints.USER.SUMMARY;
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
      console.log('Error from user summary list', error);
    }
  },
  getUserSummary: async (userID) => {
    try {
      const endPoint = apiConfig.endPoints.USER.USER_SUMMARY;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          userID: userID
        }
      });
      return response;
    } catch (error) {
      console.log('Error from user specific summary', error);
    }
  },
  getUserOverAllSummary: async (userID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER.USER_OVER_ALL_SUMMARY,
        ':userId',
        userID
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
      console.log('Error from user overall summary', error);
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
  updateUserLimit: async (data, playerId) => {
    try {
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
        HasBetLimit: data?.hasOneTimeBetLimit,
        HasWinLimit: data?.hasOneTimeWinLimit,

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
        ExclusionStartAt: data.exclusionStartAt
          ? ConvertDateIntoUTC(data.exclusionStartAt)
          : undefined,
        ExclusionEndAt: data.exclusionEndAt ? ConvertDateIntoUTC(data.exclusionEndAt) : undefined,
        BetLimit: data?.oneTimeBetLimit || undefined,
        WinLimit: data?.oneTimeWinLimit || undefined
      };

      const endPoint = replaceText(
        apiConfig.endPoints.USER.UPDATE_RISK_MANAGEMENT,
        ':userID',
        playerId
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
      console.log('Error from User Level Limit Update', error);
    }
  },
  // Responsible Gaming Limits
  getUserAllLimits: async (userId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RESPONSIBLE_GAMING_LIMITS.USER_ALL_LIMITS,
        ':userId',
        userId
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
      console.log('Error from getUserAllLimits', error);
    }
  },
  getLimitSummary: async (userId, agentUID = null) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.USER.LIMIT_SUMMARY, ':userId', userId);
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: agentUID ? { agentUID } : {}
      });
      return response;
    } catch (error) {
      console.log('Error from getLimitSummary', error);
    }
  },
  getLimitHistory: async (userUID, filters = {}) => {
    return apiInstance.post(apiConfig.endPoints.RESPONSIBLE_GAMING_LIMITS.HISTORY, {
      page: filters.page || 1,
      per_page: filters.per_page || 100,
      filters: {
        userUID,
        ...(filters.setBy && { setBy: filters.setBy }),
        ...(filters.limitType && { limitType: filters.limitType }),
        ...(filters.limitPeriod && { limitPeriod: filters.limitPeriod }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.groupBy && { groupBy: filters.groupBy })
      }
    });
  },
  getUserClassLimitHistory: async (userClassUID, filters = {}) => {
    return apiInstance.post(apiConfig.endPoints.USER_CLASS_LIMITS.HISTORY, {
      page: filters.page || 1,
      per_page: filters.per_page || 100,
      filters: {
        userClassUID: userClassUID,
        ...(filters.limitType && { limitType: filters.limitType }),
        ...(filters.limitPeriod && { limitPeriod: filters.limitPeriod }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.groupBy && { groupBy: filters.groupBy })
      }
    });
  },
  bulkUpdateUserLimits: async (userId, limits) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RESPONSIBLE_GAMING_LIMITS.USER_BULK_UPDATE,
        ':userId',
        userId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { limits }
      });
      return response;
    } catch (error) {
      console.log('Error from bulkUpdateUserLimits', error);
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
        userUID: playerId,
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
  deletePlayerNote: async (commentId) => {
    try {
      const query = {
        commentID: commentId
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
        userUID: data.playerId,
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
  },

  getPlayerDashboardCounts: async () => {
    return apiInstance.get(apiConfig.endPoints.B2B_AGENT.PLAYER_DASHBOARD_COUNTS);
  },

  resetPasswordAgentPlayer: async (userUID, password) => {
    return apiInstance.patch(apiConfig.endPoints.B2B_AGENT.PLAYER_RESET_PASSWORD(userUID), {
      password
    });
  },

  getReferrersList: async ({ page, perPage, keyword, startDate, endDate, playesIds = [] }) => {
    try {
      const body = {
        page,
        perPage,
        keyword,
        startDate,
        endDate,
        playesIds
      };
      const endPoint = apiConfig.endPoints.USER.REFERRERS_LIST;
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
      console.log('Error from getReferrersList', error);
    }
  },

  verifyKycByAdmin: async (userUID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.USER.VERIFY_KYC_BY_ADMIN,
        ':userUID',
        userUID
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          userUID: userUID
        }
      });
      return response;
    } catch (error) {
      console.log('Error from verifyKycByAdmin', error);
    }
  }
};

export default PlayerService;
