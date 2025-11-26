import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const EnquiresService = {
  list: async ({ pagination, filters }) => {
    try {
      const body = {
        page: (pagination?.pageIndex ?? 0) + 1,
        limit: pagination?.pageSize ?? 10,
        filters: {
          keyword: filters?.keyword || undefined,
          status: filters?.status || undefined,
          setBy: filters?.setBy || undefined
        }
      };
      const url = apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.ENQUIRES.LIST;
      return await sendRequest({
        url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
    } catch (error) {
      console.log('Error from Enquires list', error);
    }
  },
  detail: async (restrictionId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RESPONSIBLE_GAMBLING_RESTRICTIONS.DETAIL,
        ':restrictionId',
        restrictionId
      );
      const url = apiConfig.baseURL.API_BASE_URL + endPoint;
      return await sendRequest({
        url,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.log('Error from Enquires detail', error);
    }
  },
  delete: async (restrictionId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RESPONSIBLE_GAMBLING_RESTRICTIONS.DELETE,
        ':restrictionId',
        restrictionId
      );
      const url = apiConfig.baseURL.API_BASE_URL + endPoint;
      return await sendRequest({
        url,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.log('Error deleting Enquires item', error);
    }
  },
  changeStatus: async (status, enquiryUId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.ENQUIRES.CHANGE_STATUS,
        ':enquiryUId',
        enquiryUId
      );
      const url = apiConfig.baseURL.API_BASE_URL + endPoint;
      return await sendRequest({
        url,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: {
          status
        }
      });
    } catch (error) {
      console.log('Error changing Enquires status', error);
    }
  }
};

export default EnquiresService;
