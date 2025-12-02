import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { campaignStatusToAPI } from 'app/pages/campaign/helper';
import { replaceText } from 'utils/custom.utilities';

const CampaignService = {
  campaignList: async (data) => {
    try {
      const { filters, pagination } = data;
      console.log('filters:', filters);

      const reqBody = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        filters: {
          keyword: filters?.keyword || undefined,
          status: campaignStatusToAPI(filters?.status),
          startDate: filters?.startDate || undefined,
          endDate: filters?.endDate || undefined
        }
      };
      const endPoint = apiConfig.endPoints.CAMPAIGN.LIST;
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
      console.log('Error from Campaign List', error);
    }
  },

  createCampaign: async (data) => {
    try {
      const reqBody = {
        campaignName: data.campaignName,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description || '',
        tags: data.tags || []
      };
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.CAMPAIGN.CREATE,
        method: 'POST',
        body: reqBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },

  campaignDetail: async (id) => {
    const endPoint = replaceText(apiConfig.endPoints.CAMPAIGN.DETAIL, ':campaignUID', id);
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'GET'
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },

  updateCampaign: async (data) => {
    try {
      const reqBody = {
        campaignUID: data.campaignUID,
        campaignName: data.campaignName,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description || '',
        tags: data.tags || []
      };
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.CAMPAIGN.UPDATE,
        method: 'PUT',
        body: reqBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },

  changeCampaignStatus: async (campaignUID) => {
    const endPoint = replaceText(
      apiConfig.endPoints.CAMPAIGN.CHANGE_STATUS,
      ':campaignUID',
      campaignUID
    );
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },

  deleteCampaign: async (campaignUID) => {
    const endPoint = replaceText(apiConfig.endPoints.CAMPAIGN.DELETE, ':campaignUID', campaignUID);
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },

  archiveCampaign: async (campaignUID) => {
    const endPoint = replaceText(apiConfig.endPoints.CAMPAIGN.ARCHIVE, ':campaignUID', campaignUID);
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },

  cloneCampaign: async (campaignUID) => {
    const endPoint = replaceText(apiConfig.endPoints.CAMPAIGN.CLONE, ':campaignUID', campaignUID);
    try {
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export default CampaignService;
