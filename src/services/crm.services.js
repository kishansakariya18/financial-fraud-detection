import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';
import dayjs from 'dayjs';
import { parseTypeToApi, parseNotificationStatusToApi } from 'app/pages/crm/helper';

const EmailTemplateService = {
  getNotificationsList: async ({ pagination, filters }) => {
    try {
      console.log('filters: ', filters);
      const endPoint = apiConfig.endPoints.CRM.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          page: pagination.pageIndex + 1,
          perPage: pagination.pageSize,
          startDate: filters.startDate ? dayjs(+filters.startDate).format('YYYY-MM-DD') : undefined,
          endDate: filters.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          channel: filters?.channel || undefined,
          type:
            filters?.type && parseTypeToApi(filters.type) !== -1
              ? parseTypeToApi(filters.type)
              : undefined,
          status:
            filters?.status && parseNotificationStatusToApi(filters.status) !== -1
              ? parseNotificationStatusToApi(filters.status)
              : undefined,
          keyword: filters?.keyword || undefined
        }
      });
      return response;
    } catch (error) {
      console.log('Error from CRM Notifications List', error);
    }
  },
  getNotificationDetail: async (notificationId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.CRM.DETAIL,
        ':notificationId',
        notificationId
      );
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
      console.log('Error from CRM Notification Detail', error);
    }
  },
  send: async (data) => {
    try {
      // const { filters, pagination } = data;
      const reqBody = {
        channel: data.channel || undefined,
        description: data.description || undefined,
        recipientGroupID: [],
        recipientGroup: '',
        subject: data.subject || undefined,
        sendType: data.sendType || 1,
        deliveryDateTime: data.deliveryDateTime || undefined
      };

      if (data.sendTo === 'segmentation') {
        reqBody.recipientGroup = 'segmentation';
        reqBody.recipientGroupID = [data.segmentationID];
      } else if (data.sendTo === 'userClass') {
        reqBody.recipientGroup = 'userclass';
        reqBody.recipientGroupID = [data.UserClassID];
      }
      const endPoint = apiConfig.endPoints.CRM.SEND;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqBody
      });
      return response;
    } catch (error) {
      console.log('Error from Page List', error);
    }
  }
};

export default EmailTemplateService;
