import { emailTemplateStatusToAPI } from 'app/pages/event-template/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';

const EventTemplateService = {
  eventTemplateList: async (data) => {
    try {
      const { filters, pagination } = data;
      console.log('filters:', filters);

      const reqBody = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filters: {
          keyword: filters?.keyword || undefined,
          status: emailTemplateStatusToAPI(filters?.status),
          endDate: filters.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          startDate: filters.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          eventGroupID: filters?.eventGroupId || undefined,
          channelCode: filters?.channelCode || undefined
        }
      };
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.LIST;
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
      console.log('Error from eventTemplateList List', error);
    }
  },
  getEventMasterData: async () => {
    try {
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.TEMPLATE_MASTER_DATA;
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
      console.log('Error from getEventMasterData List', error);
    }
  },
  getTemplateData: async (groupID) => {
    try {
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.TEMPLATE_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { groupID }
      });
      return response;
    } catch (error) {
      console.log('Error from getTemplateData List', error);
    }
  },
  assignEventTemplate: async (body) => {
    try {
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.ASSIGN_EVENT_TEMPLATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });
      return response;
    } catch (error) {
      console.log('Error from getTemplateData List', error);
    }
  },
  eventTemplateSubmit: async (data) => {
    try {
      const reqBody = {
        title: data.title,
        slug: data.slug,
        heading: data.heading,
        template: data.template,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        status: emailTemplateStatusToAPI(data.status),
        channelID: data.channel,
        eventTypeID: data.eventType,
        groupID: data.group
      };
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.ADD;
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
  eventTemplateUpdate: async (data) => {
    try {
      const reqBody = {
        templateID: data.templateID,
        title: data.title,
        slug: data.slug,
        heading: data.heading,
        eventTypeID: data.eventType,
        channelID: data.channel,
        template: data.template,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        status: emailTemplateStatusToAPI(data.status)
      };
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.UPDATE;
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
  eventTemplateDetail: async (templateID) => {
    try {
      const reqBody = {
        templateID
      };
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.DETAIL;
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
      console.log('Error from eventTemplateUpdate', error);
    }
  },
  eventTemplateStatus: async (templateID) => {
    try {
      const endPoint = apiConfig.endPoints.EVENT_TEMPLATE.STATUS;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          templateID
        }
      });
      return response;
    } catch (error) {
      console.log('Error from eventTemplateStatus', error);
    }
  }
};

export default EventTemplateService;
