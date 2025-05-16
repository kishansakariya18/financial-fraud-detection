import {
  currencyTypeToAPI,
  discountTypeToAPI,
  displayTypeToAPI,
  influencerSegTypeToAPI,
  parsePromoCodeStatusStatusToApi,
  segmentationTypeToAPI
} from 'app/pages/promocode/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const PromoCodeService = {
  getPromocodes: async (body) => {
    try {
      const { pagination, filters } = body;

      const apiQueryParams = {
        per_page: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        status: filters.status ? parsePromoCodeStatusStatusToApi(filters.status) : undefined,
        keyword: filters.keyword || undefined,
        start_date: filters.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        end_date: filters.endDate
          ? dayjs(+filters.endDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined
      };

      let apiURL = null;

      apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_LIST}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: { filters: apiRequestParams },
          params: apiQueryParams
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getPromocodeDetail: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_DETAIL,
        ':promocodeId',
        id
      );

      let apiURL = null;

      apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error', err);
    }
  },
  createPromocode: async (data) => {
    try {
      const requestObject = {
        PromoCode: data.promocode,
        DepositRequirementType: data.type,
        BenefitCurrencyType: currencyTypeToAPI(data.currency),
        DiscountType: discountTypeToAPI(data.discountType),
        InfluencerSegmentationType: influencerSegTypeToAPI(data.influencerSegType),
        SegmentationType: segmentationTypeToAPI(data.segmentationType),
        segmentationIds: data.segmentationIds || [],
        AffiliateIds: data.influencerSegIds || [],
        Amount: data.discount,
        BenefitCap: data.benefitCap || 0,
        UsageLimit: data.promocodeQty,
        UserLimit: data.allowedPerUser || 0,
        Description: data.description,
        IsPubliclyVisible: displayTypeToAPI(data.displayMode),
        StartDate: data.startDate
          ? dayjs(+data.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        EndDate: data.endDate
          ? dayjs(+data.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        IsFirstDepositOnly: data.isOnlyFirstDeposit,
        IsSecondDepositOnly: data.isOnlyFirstDeposit,
        MinAmount: data.minAmount || 0,
        MaxAmount: data.maxAmount || 0,
        ExactAmount: data.exactAmount || 0
      };

      let apiURL = null;
      apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_CREATE}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestObject
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error', err);
    }
  },
  changePromocodeStatus: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_CHANGE_STATUS,
        ':promocodeId',
        id
      );

      let apiURL = null;

      apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getPromocodeHistory: async (body) => {
    try {
      const { promocodeId, pagination } = body;

      const apiQueryParams = {
        per_page: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      const endPoint = replaceText(
        apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_HISTORY,
        ':promocodeId',
        promocodeId
      );

      let apiURL = null;

      apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          params: apiQueryParams
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getSegmentationDetail: async (id) => {
    try {
      console.log('promocode id: ', id);

      const endPoint = replaceText(
        apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_SEGMENTATION,
        ':promocodeId',
        id
      );
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('response: ', response);

      return response;
    } catch (err) {
      console.log('Error from get promocode segmentation', err);
    }
  },
  submitSegmentationData: async (id, data) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.BASKETBALL.DEPOSIT_PROMOCODE.PROMOCODE_UPLOAD_SEGMENTATION,
        ':promocodeId',
        id
      );

      const formData = new FormData();
      formData.append('file_name', data, data.name);

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'POST',
        headers: {
          'content-Type': 'multipart/form-data'
        },
        body: formData,
        contentType: 'form-data'
      });

      return response;
    } catch (err) {
      console.log('Error from upload promocode segmentation', err);
    }
  },
  removeSegmentationData: async (id) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_SEGMENTATION,
        ':promocodeId',
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
      console.log('Error from remove promocode segmentation', err);
    }
  },
  deletePromoCode: async (id) => {
    try {
      console.log('deletePromoCode: ');

      const endPoint = replaceText(
        apiConfig.endPoints.DEPOSIT_PROMOCODE.PROMOCODE_DELETE,
        ':promocodeId',
        id
      );
      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + endPoint,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response;
    } catch (error) {
      console.log('Error from delete promo code', error);
    }
  }
};

export default PromoCodeService;
