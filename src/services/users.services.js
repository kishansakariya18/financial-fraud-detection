// import { replaceText } from '../helpers/functions';

import {
  playerStatusToAPI,
  playerKycToAPI,
  emailVerifyOptionToAPI,
  mobileVerifyOptionToAPI
} from 'components/sections/player-management/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';

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

  getAllUserTransactionList: async () => {
    try {
      // const query = {
      //   page: +reqBody.currentPage,
      //   perPage: +reqBody.perPage
      // };
      // const body = {
      //   filters: {
      //     keyword: reqBody?.filters?.keyword,
      //     endDate: reqBody?.filters?.endDate
      //       ? ConvertDateIntoUTC(reqBody?.filters?.endDate + ' 23:59:59')
      //       : '',
      //     startDate: ConvertDateIntoUTC(reqBody?.filters?.startDate),
      //     // type: reqBody?.filters?.type
      //     transactionType: +reqBody?.filters.transactionType
      //   }
      // };
      const endPoint = apiConfig.endPoints.USER.ALL_TRANSACTION_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
        // body,
        // params: query
      });
      return response;
    } catch (error) {
      console.log('Error from userTransactionList', error);
    }
  }
};

export default PlayerService;
