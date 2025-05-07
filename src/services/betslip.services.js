import { getStageAppToApi, mapType } from 'app/pages/reports/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';

const ReportService = {
  getBetSlipTransaction: async (body) => {
    try {
      const { pagination, filters } = body;

      const { type, keyword, startDate, endDate, stage } = filters;
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
        stage: getStageAppToApi(stage) > -1 ? getStageAppToApi(stage) : undefined
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
  }
};

export default ReportService;
