import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const FaqService = {
  list: async (data) => {
    try {
      const { pagination = {}, filters = {}, isPaginationRequired = true } = data || {};

      const apiQueryParams = {
        perPage: pagination?.pageSize,
        page: (pagination?.pageIndex || 0) + 1
      };

      const apiRequestParams = {
        keyword: filters.keyword || undefined,
        faqStatus:
          filters.faqStatus !== '' && filters.faqStatus != null ? filters.faqStatus : undefined,
        module: filters.module || undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.FAQ.LIST}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { filters: apiRequestParams, isPaginationRequired },
        params: apiQueryParams
      });

      return response;
    } catch (error) {
      console.log('Error fetching FAQ list', error);
      return { status: 500, error: 'Failed to fetch FAQs' };
    }
  },
  create: async (payload) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.FAQ.CREATE}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      return response;
    } catch (error) {
      console.log('Error creating FAQ', error);
    }
  },
  update: async (payload) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.FAQ.UPDATE}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      return response;
    } catch (error) {
      console.log('Error updating FAQ', error);
    }
  },
  delete: async (payload) => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.FAQ.DELETE}`,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      return response;
    } catch (error) {
      console.log('Error deleting FAQ', error);
    }
  }
};

export default FaqService;
