import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const ResponsibleGamblingService = {
  list: async ({ pagination, filters }) => {
    try {
      const body = {
        page: (pagination?.pageIndex ?? 0) + 1,
        per_page: pagination?.pageSize ?? 10,
        filters: {
          restrictionType: filters?.keyword || undefined,
          status: filters?.status || undefined,
          setBy: filters?.setBy || undefined
        }
      };
      const url =
        apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.RESPONSIBLE_GAMBLING_RESTRICTIONS.LIST;
      return await sendRequest({
        url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
    } catch (error) {
      console.log('Error from Responsible Gambling list', error);
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
      console.log('Error from Responsible Gambling detail', error);
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
      console.log('Error deleting Responsible Gambling item', error);
    }
  },
  changeStatus: async (restrictionId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.RESPONSIBLE_GAMBLING_RESTRICTIONS.APPROVE,
        ':restrictionId',
        restrictionId
      );
      const url = apiConfig.baseURL.API_BASE_URL + endPoint;
      return await sendRequest({
        url,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.log('Error changing Responsible Gambling status', error);
    }
  }
};

export default ResponsibleGamblingService;
