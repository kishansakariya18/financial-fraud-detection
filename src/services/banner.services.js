import { parseBannerStatusToApi } from 'app/pages/banner/helper';
import apiConfig from 'configs/api.config';
import { getEndDate, getEndOfDate, getStartDate, getStartofDate } from 'helpers/functions';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const BannerService = {
  getBannerList: async (body) => {
    try {
      const { pagination, filters, isPaginationRequired = true } = body;

      const { status, keyword, startDate, endDate } = filters;

      const apiQueryParams = {
        perPage: pagination?.pageSize,
        page: (pagination?.pageIndex || 0) + 1
      };

      const apiRequestParams = {
        status: status ? parseBannerStatusToApi(status) : undefined,
        keyword: keyword || undefined,
        startDate: startDate ? getStartDate(+startDate) : undefined,
        endDate: endDate ? getEndDate(+endDate) : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BANNER.BANNER_LIST}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams, isPaginationRequired },
        params: apiQueryParams
      });

      console.log('response: ', response);

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  createBanner: async (data, file) => {
    try {
      console.log('file: ', file);

      const formData = new FormData();
      data.bannerName && formData.append('bannerName', data.bannerName);
      data.placementType && formData.append('placementType', data.placementType);
      data.startDate && formData.append('startDate', getStartofDate(+data.startDate));
      data.endDate && formData.append('endDate', getEndOfDate(+data.endDate));
      data.bannerHeadline && formData.append('headLine', data.bannerHeadline);
      data.bannerSubHeadline && formData.append('subHeadLine', data.bannerSubHeadline);
      data.targetUrl && formData.append('targetUrl', data.targetUrl);
      data.segmentationType >= 0 && formData.append('segmentationType', data.segmentationType);

      if (data.segmentationType === 1 && data.segmentationIds) {
        for (let i = 0; i < data.segmentationIds.length; i++) {
          formData.append(`segmentationIds[${i}]`, data.segmentationIds[i]);
        }
      }

      if (file && file.name) {
        formData.append('media', file, file.name);
      }

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.BANNER.BANNER_CREATE,
        method: 'POST',
        body: formData,
        contentType: 'form-data',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  editBanner: async (id, data, file) => {
    try {
      console.log('file: ', file);

      const endPoint = replaceText(apiConfig.endPoints.BANNER.BANNER_EDIT, ':bannerId', id);

      const formData = new FormData();
      data.bannerName && formData.append('bannerName', data.bannerName);
      data.placementType && formData.append('placementType', data.placementType);
      data.startDate && formData.append('startDate', getStartofDate(+data.startDate));
      data.endDate && formData.append('endDate', getEndOfDate(+data.endDate));
      data.bannerHeadline && formData.append('headLine', data.bannerHeadline);
      data.bannerSubHeadline && formData.append('subHeadLine', data.bannerSubHeadline);
      data.targetUrl && formData.append('targetUrl', data.targetUrl);
      data.segmentationType >= 0 && formData.append('segmentationType', data.segmentationType);

      if (data.segmentationType === 1 && data.segmentationIds) {
        for (let i = 0; i < data.segmentationIds.length; i++) {
          formData.append(`segmentationIds[${i}]`, data.segmentationIds[i]);
        }
      }

      if (file && file.name) {
        formData.append('media', file, file.name);
      }

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'PUT',
        body: formData,
        contentType: 'form-data',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  deleteBanner: async (id) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.BANNER.BANNER_DELETE, ':bannerId', id);

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
  changeBannerStatus: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.BANNER.BANNER_CHANGE_STATUS,
        ':bannerId',
        id
      );

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
  getBannerDetails: async (id) => {
    try {
      const endPoint = replaceText(apiConfig.endPoints.BANNER.BANNER_DETAIL, ':bannerId', id);
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${endPoint}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  },
  reorderBanner: async (data) => {
    try {
      console.log('bannerOrderList: ', data);

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BANNER.BANNER_REORDER}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          bannerOrderList: data
        }
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
    }
  }
};

export default BannerService;
