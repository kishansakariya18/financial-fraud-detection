import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const EmailTemplateService = {
  emailTemplateSubmit: async (data) => {
    try {
      const reqBody = {
        title: data.title,
        slug: data.slug,
        heading: data.heading,
        template: data.template,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        status: data.status
      };
      const endPoint = apiConfig.endPoints.EMAIL_TEMPLATE.ADD;
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
      console.log('Error from emailTemplateSubmit', error);
    }
  },
  emailTemplateUpdate: async (data) => {
    try {
      const reqBody = {
        emailTemplateID: data.emailTemplateID,
        title: data.title,
        slug: data.slug,
        heading: data.heading,
        template: data.template,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        status: data.status
      };
      const endPoint = apiConfig.endPoints.EMAIL_TEMPLATE.UPDATE;
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
      console.log('Error from emailTemplateUpdate', error);
    }
  },
  emailTemplateDetail: async (emailTemplateID) => {
    try {
      const reqBody = {
        emailTemplateID
      };
      const endPoint = apiConfig.endPoints.EMAIL_TEMPLATE.DETAIL;
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
      console.log('Error from emailTemplateDetail', error);
    }
  }
};

export default EmailTemplateService;
