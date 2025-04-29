import { replaceText } from 'utils/custom.utilities';
import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import dayjs from 'dayjs';
const AuditLogsService = {
  auditLogsList: async (data) => {
    try {
      const { pagination, filters } = data;

      console.log('data: ', data);
      const apiRequestParams = {
        filters: {
          keyword: filters.keyword ? filters.keyword : undefined,
          module: filters.module ? filters.module : undefined,
          start_date: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          end_date: filters.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        },
        per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      console.log('apiRequestParams: ', apiRequestParams);
      const endPoint = apiConfig.endPoints.AUDIT_LOGS.VIEW;
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
      console.log('Error from role Permission List', error);
    }
  },
  auditLogsDetail: async (Id) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.AUDIT_LOGS.DETAIL, ':Id', Id);
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
      console.log('Error from role detail permission', error);
    }
  }
};

export default AuditLogsService;
