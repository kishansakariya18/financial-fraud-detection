import { parseProviderStatusToApi } from 'app/pages/casino-management/provider/helper';
import apiConfig from 'configs/api.config';
import { getEndDate, getStartDate } from 'helpers/functions';
import { sendRequest } from 'utils/axios';

const GamesService = {
  getGamesList: async (body) => {
    try {
      const { pagination, filters, isPaginationRequired = true } = body;

      const {
        status,
        keyword,
        startDate,
        endDate,
        provider,
        providerIds,
        categoryIds,
        onlyFreeSpinSupport = undefined
      } = filters;

      const apiQueryParams = {};
      if (pagination) {
        apiQueryParams.perPage = pagination.pageSize;
        apiQueryParams.page = pagination.pageIndex + 1;
      }

      const apiRequestParams = {
        status: status ? parseProviderStatusToApi(status) : undefined,
        keyword: keyword || undefined,
        startDate: startDate ? getStartDate(startDate) : undefined,
        endDate: endDate ? getEndDate(endDate) : undefined,
        providerId: provider || undefined,
        providerIds: providerIds || undefined,
        categoryIds: categoryIds || undefined,
        onlyFreeSpinSupport
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.GAME.LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams, isPaginationRequired },
        params: apiQueryParams
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export default GamesService;
