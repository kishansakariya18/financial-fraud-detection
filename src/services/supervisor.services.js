import { parseAdminStatusToApi } from 'app/pages/users/admin/helper';
import apiConfig from '../configs/api.config';
import dayjs from 'dayjs';
import { replaceText } from 'utils/custom.utilities';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import apiInstance from 'utils/apiInstance';

const SupervisorService = {
  getDashboard: async (params) => {
    return apiInstance.get(apiConfig.endPoints.SUPERVISOR.DASHBOARD, { params });
  },

  getAllSupervisor: async (data) => {
    const { pagination, filters } = data;

    const apiRequestParams = {
      filters: {
        keyword: filters.keyword || undefined,
        status: filters.status ? parseAdminStatusToApi(filters.status) : undefined,
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

    return apiInstance.post(apiConfig.endPoints.SUPERVISOR.LIST, apiRequestParams);
  },

  getSupervisorDetail: (id) => {
    const endPoint = replaceText(apiConfig.endPoints.SUPERVISOR.DETAIL, ':supervisorId', id);
    return apiInstance.get(endPoint);
  }

  // changeSupervisorStatus: (supervisorUID) => {
  //   const endPoint = replaceText(
  //     apiConfig.endPoints.SUPERVISOR.CHANGE_STATUS,
  //     ':supervisorId',
  //     supervisorUID
  //   );
  //   return apiInstance.get(endPoint);
  // },

  // createSupervisor: (data) => {
  //   const requestObject = {
  //     username: data.userName,
  //     firstname: data.firstName,
  //     lastname: data.lastName,
  //     email: data.email,
  //     phoneCode: data.phoneCode,
  //     mobile: data.mobile,
  //     password: data.password,
  //     status: parseAdminStatusToApi(data.status)
  //   };
  //   return apiInstance.post(apiConfig.endPoints.SUPERVISOR.CREATE, requestObject);
  // },

  // editSupervisor: (data) => {
  //   const requestObject = {
  //     username: data.userName,
  //     firstname: data.firstName,
  //     lastname: data.lastName,
  //     email: data.email,
  //     phoneCode: data.phoneCode,
  //     mobile: data.mobile,
  //     password: data.password || undefined,
  //     status: parseAdminStatusToApi(data.status),
  //     adminUID: data.adminUID
  //   };
  //   return apiInstance.post(apiConfig.endPoints.SUPERVISOR.EDIT, requestObject);
  // }
};

export default SupervisorService;
