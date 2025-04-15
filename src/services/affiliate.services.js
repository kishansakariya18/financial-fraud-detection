import {
  affiliateStatusToApi,
  affiliateTransactionToAPI,
  parsePayoutStatusToAPI
} from 'app/pages/affiliate/helper';
import { transactionTypeAppToApi } from 'app/pages/users/player/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const AffiliateService = {
  getAffiliateList: async (data) => {
    try {
      const { pagination, filters } = data;
      const reqBody = {
        page: pagination.pageIndex + 1,
        limit: pagination?.pageSize,
        keyword: filters?.keyword,
        startDate: filters.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        endDate: filters.endDate
          ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        status: filters?.status ? affiliateStatusToApi(filters.status) : undefined
      };
      const endPoint = apiConfig.endPoints.AFFILIATE.AFFILIATE_LIST;
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
      console.log('Error', error);
    }
  },
  AffiliateStatus: async (affiliateUID) => {
    try {
      const body = {
        affiliateUID
      };
      const endPoint = apiConfig.endPoints.AFFILIATE.CHANGE_STATUS;
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
      console.log('Error from AffiliateStatus', error);
    }
  },
  createAffiliate: async (data) => {
    try {
      const requestObject = {
        username: data.userName,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        mobile: data.mobile,
        referralcode: data.referralCode,
        password: data.password,
        status: affiliateStatusToApi(data.status),
        signupcomissionenabled: data?.perSignup ? 1 : 0,
        signupcomissiontype: data?.signupcomissiontype,
        signupcomission: data?.signupCommission,
        depositcomissionenabled: data?.perDeposit ? 1 : 0,
        depositcomissiontype: data?.depositCommissionType,
        depositcomission: data?.depositCommission,
        userlosscomissionenabled: data?.perPlayerLoss ? 1 : 0,
        userlosscomissiontype: data?.playerLossCommissionType,
        userlosscomission: data?.playerLossCommission
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.AFFILIATE.CREATE,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getAffiliateDetail: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.AFFILIATE.AFFILIATE_DETAIL,
        ':affiliateId',
        id
      );
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
  editAffiliate: async (data) => {
    try {
      const requestObject = {
        affiliateUID: data.affiliateUID,
        username: data.userName,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        mobile: data.mobile,
        referralcode: data.referralCode,
        status: affiliateStatusToApi(data.status),
        signupcomissionenabled: data?.perSignup ? 1 : 0,
        signupcomissiontype: data?.signupcomissiontype,
        signupcomission: data?.signupCommission,
        depositcomissionenabled: data?.perDeposit ? 1 : 0,
        depositcomissiontype: data?.depositCommissionType,
        depositcomission: data?.depositCommission,
        userlosscomissionenabled: data?.perPlayerLoss ? 1 : 0,
        userlosscomissiontype: data?.playerLossCommissionType,
        userlosscomission: data?.playerLossCommission
      };
      // const requestObject = {
      //   affiliateId: data.affiliateId,
      //   username: data.username,
      //   firstname: data.firstname,
      //   lastname: data.lastname,
      //   email: data.email,
      //   mobile: data.mobile,
      //   referralcode: data.referralcode,
      //   signupcomissionenabled: data?.signupcomissionenabled ? 1 : 0,
      //   signupcomissiontype: data?.signupcomissiontype,
      //   signupcomission: data?.signupcomission,
      //   depositcomissionenabled: data?.depositcomissionenabled ? 1 : 0,
      //   depositcomissiontype: data?.depositcomissiontype,
      //   depositcomission: data?.depositcomission,
      //   userlosscomissionenabled: data?.userlosscomissionenabled ? 1 : 0,
      //   userlosscomissiontype: data?.userlosscomissiontype,
      //   userlosscomission: data?.userlosscomission
      // };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.AFFILIATE.AFFILIATE_EDIT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  playerJoinedList: async (data) => {
    try {
      const { pagination, filters, affiliateUID } = data;
      const body = {
        affiliateUID: affiliateUID,
        filters: {
          keyword: filters.keyword ? filters.keyword : undefined,
          startDate: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endDate: filters.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        }
      };
      const reqQuery = {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize
      };
      const endPoint = apiConfig.endPoints.AFFILIATE.USER_JOINED_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
        params: reqQuery
      });
      return response;
    } catch (error) {
      console.log('Error from UserJoinedList', error);
    }
  },
  affiliateTransactionList: async (data) => {
    try {
      const { pagination, filters, affiliateUID } = data;
      const body = {
        affiliateUID,
        filters: {
          keyword: filters.keyword ? filters.keyword : undefined,
          type: filters.transactionType
            ? affiliateTransactionToAPI(filters.transactionType)
            : undefined,
          startDate: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endDate: filters.endDate
            ? dayjs(+filters.endDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        }
      };
      const reqQuery = {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize
      };
      const endPoint = apiConfig.endPoints.AFFILIATE.TRANSACTION_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body,
        params: reqQuery
      });
      return response;
    } catch (error) {
      console.log('Error from affiliateTransactionList: ', error);
    }
  },
  getPayoutHistory: async (data) => {
    try {
      const { affiliateUID, filters, pagination } = data;

      const apiBody = {
        affiliateUID,
        filters: {
          status: filters.status ? parsePayoutStatusToAPI(filters?.status) : undefined,
          startDate: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endDate: filters.endDate
            ? dayjs(+filters.endDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        }
      };
      const reqQuery = {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AFFILIATE.PAYOUT_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiBody,
        params: reqQuery
      });

      return response;
    } catch (error) {
      console.log('err: ', error);
    }
  },
  updatePayoutRequest: async (data) => {
    try {
      const bodyData = {
        affiliateUID: data.affiliateUID,
        payoutRequestId: data.payoutRequestId,
        status: parsePayoutStatusToAPI(data.status),
        rejectReason: data.rejectReason ? data.rejectReason.trim() : ''
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.AFFILIATE.UPDATE_PAYOUT}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: bodyData
      });

      return response;
    } catch (error) {
      console.log('err: ', error);
    }
  },
  manageAffiliateFund: async (reqBody) => {
    try {
      const reqData = {
        amount: reqBody.amount,
        affiliateUID: reqBody.affiliateUID,
        type: transactionTypeAppToApi(reqBody.type),
        fundMessage: reqBody.fundMessage,
        password: reqBody.password
      };
      const endPoint = apiConfig.endPoints.AFFILIATE.FUND;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqData
      });
      return response;
    } catch (error) {
      console.log('Error from affiliateFund', error);
    }
  },
  getAffiliateLoginHistory: async (data) => {
    try {
      const { pagination, affiliateUID } = data;
      const query = {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize
      };
      const endPoint = replaceText(
        apiConfig.endPoints.AFFILIATE.AFFILIATE_LOGIN_HISTORY,
        ':affiliateID',
        affiliateUID
      );
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
      console.log('Error from getAffiliateLoginHistory ', error);
    }
  }
};

export default AffiliateService;
