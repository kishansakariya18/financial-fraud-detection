import { getStageAppToApi, mapType } from 'app/pages/reports/helper';
import {
  playerStatusToAPI,
  transactionStatusToAPI
} from 'components/sections/player-management/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { sendRequest } from 'utils/axios';

const ReportService = {
  getBetSlipTransaction: async (body) => {
    try {
      const { pagination, filters } = body;

      const { type, keyword, startDate, endDate, stage, currencyID } = filters;
      console.log('filters:', filters);

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        type: mapType(type) || undefined,
        keyword: keyword || undefined,
        startDate: startDate ? dayjs(+startDate).format('YYYY-MM-DD HH:mm:ss') : undefined,
        endDate: endDate
          ? dayjs(+endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        stage: getStageAppToApi(stage) > -1 ? getStageAppToApi(stage) : undefined,
        currency:
          typeof currencyID !== 'undefined' && currencyID !== null && currencyID !== ''
            ? currencyID.includes(',')
              ? currencyID.split(',')
              : [currencyID]
            : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REPORTS.BETSLIP}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getDepositTransactions: async (body) => {
    try {
      const { pagination, filters } = body;

      const { keyword, startDate, endDate, status } = filters;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        keyword: keyword || undefined,
        startDate: startDate ? dayjs(+startDate).format('YYYY-MM-DD HH:mm:ss') : undefined,
        endDate: endDate
          ? dayjs(+endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        status: status ? transactionStatusToAPI(status) : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REPORTS.DEPOSIT_TRANSACTIONS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getWithdrawTransactions: async (body) => {
    try {
      const { pagination, filters } = body;

      const { keyword, startDate, endDate, status } = filters;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        keyword: keyword || undefined,
        startDate: startDate ? moment(+startDate).startOf('day').toDate() : undefined,
        endDate: endDate ? moment(+endDate).endOf('day').toDate() : undefined,
        status: status ? transactionStatusToAPI(status) : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REPORTS.WITHDRAW_TRANSACTIONS}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getPlayerBalance: async (body) => {
    try {
      const { pagination, filters } = body;

      const { keyword, startDate, endDate, status } = filters;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        keyword: keyword || undefined,
        startDate: startDate ? dayjs(+startDate).format('YYYY-MM-DD HH:mm:ss') : undefined,
        endDate: endDate ? dayjs(+endDate).format('YYYY-MM-DD HH:mm:ss') : undefined,
        status: status ? playerStatusToAPI(status) : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REPORTS.PLAYER_BALANCE_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getDepositBonus: async (body) => {
    try {
      const { pagination, filters } = body;

      const { keyword, startDate, endDate } = filters;

      const apiQueryParams = {
        perPage: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        keyword: keyword || undefined,
        startDate: startDate ? dayjs(+startDate).format('YYYY-MM-DD HH:mm:ss') : undefined,
        endDate: endDate ? dayjs(+endDate).format('YYYY-MM-DD HH:mm:ss') : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.REPORTS.PLAYER_BALANCE_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export default ReportService;
