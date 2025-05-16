import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const EmailTemplateService = {
  send: async (data) => {
    try {
      // const { filters, pagination } = data;
      const reqBody = {
        channel: data.channel || undefined,
        description: data.description || undefined,
        segmentationID: data.segmentationID || undefined,
        subject: data.subject || undefined
      };
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
