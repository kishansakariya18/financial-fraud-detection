import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const EmailTemplateService = {
  getNotificationsList: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.CRM.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          page: pagination.pageIndex + 1,
          perPage: pagination.pageSize,
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
