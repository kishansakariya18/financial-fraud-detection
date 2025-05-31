import { parseAdminStatusToApi } from 'app/pages/users/admin/helper';
import apiConfig from '../configs/api.config';
import { sendRequest } from '../utils/axios';
import dayjs from 'dayjs';
import { replaceText } from 'utils/custom.utilities';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { parseServiceToAPI, parseTenantStatusToAPI } from 'app/pages/tenant/helper';

const TenantService = {
  getTenantList: async (data) => {
    try {
      const { pagination, filters } = data;

      console.log('data: ', data);

      const apiRequestParams = {
        filters: {
          keyword: filters.keyword ? filters.keyword : undefined,
          status: filters.status ? parseAdminStatusToApi(filters.status) : undefined,
          startDate: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endDate: filters.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        },
        per_page: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD,
        page: pagination.pageIndex + 1
      };

      console.log('apiRequestParams: ', apiRequestParams);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.TENANT.LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: apiRequestParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changeTenantStatus: async (tenantUID) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.TENANT.CHANGE_STATUS,
        ':tenantUID',
        tenantUID
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

  createTenant: async (data) => {
    try {
      const requestObject = {
        username: data.userName,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        url: data.url,
        mobile: data.mobile,
        password: data.password,
        service: parseServiceToAPI(data.service),
        status: parseTenantStatusToAPI(data.status)
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.TENANT.CREATE,
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
  }
};

export default TenantService;
