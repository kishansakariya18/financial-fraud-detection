import { emailTemplateStatusToAPI } from 'app/pages/email-template/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const EmailTemplateService = {
  emailTemplateList: async (data) => {
    try {
      const { filters, pagination } = data;
      const reqBody = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        keyword: filters?.keyword || undefined
      };
      const endPoint = apiConfig.endPoints.EMAIL_TEMPLATE.LIST;
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
  },
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
        status: emailTemplateStatusToAPI(data.status)
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
        emailTemplateID: data.emailTemplateId,
        title: data.title,
        slug: data.slug,
        heading: data.heading,
        template: data.template,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        status: emailTemplateStatusToAPI(data.status)
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
      console.log('Error from emailTemplateSubmit', error);
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
      console.log('Error from emailTemplateSubmit', error);
    }
  },
  emailTemplateStatus: async (emailTemplateID) => {
    try {
      const endPoint = apiConfig.endPoints.EMAIL_TEMPLATE.STATUS;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          emailTemplateID
        }
      });
      return response;
    } catch (error) {
      console.log('Error from emailTemplateSubmit', error);
    }
  }
};

export default EmailTemplateService;
