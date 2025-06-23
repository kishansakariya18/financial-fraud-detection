import { parseSegmentationStatusToAPI } from 'app/pages/segmentation/helper';
import { playerStatusToAPI } from 'app/pages/users/player/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const SegmentationService = {
  getSegmentationList: async (body) => {
    try {
      const { pagination, filters } = body;

      const apiRequestParams = {
        filters: {
          keyword: filters?.keyword || undefined,
          status: filters?.status ? parseSegmentationStatusToAPI(filters.status) : undefined,
          startDate: filters?.startDate
            ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
            : undefined,
          endDate: filters?.endDate
            ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
            : undefined
        },
        per_page: pagination ? pagination.pageSize : undefined,
        page: pagination ? pagination.pageIndex + 1 : undefined,
        ...(!pagination && { pagination: false })
      };

      let apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.SEGMENTATION.LIST}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: apiRequestParams
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error getSegmentationList: ', err);
    }
  },
  getUserList: async (body) => {
    try {
      const { pagination, filters, segmentationUID } = body;

      const apiQueryParams = {
        perPage: pagination ? pagination.pageSize : undefined,
        page: pagination ? pagination.pageIndex + 1 : undefined
      };

      const apiFilters = {
        keyword: filters?.keyword || undefined,
        status: filters?.status ? playerStatusToAPI(filters.status) : undefined,
        startDate: filters?.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        endDate: filters?.endDate
          ? dayjs(+filters.endDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss')
          : undefined
      };

      let apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.SEGMENTATION.USER_LIST}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: { filters: apiFilters, segmentationUID },
          params: apiQueryParams
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error getSegmentationList: ', err);
    }
  },
  getAllSegmentationList: async () => {
    try {
      let apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.SEGMENTATION.ALL_LIST}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response;
      }
      return null;
    } catch (err) {
      console.log('Error getSegmentationList: ', err);
    }
  },
  getSegmentationDetails: async (uid) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.SEGMENTATION.DETAIL,
        ':segmentationUID',
        uid
      );
      let apiURL = `${apiConfig.baseURL.API_BASE_URL}${endPoint}`;

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
      console.log('Error getSegmentationDetails: ', err);
    }
  },
  addEditSegmentationList: async (data) => {
    try {
      const apiBodyData = {
        UID: data?.segmentationUID,
        Name: data.name,
        KYCCheck: data.kyc,
        KYC: data.kycType,
        CountryCheck: data.countryCheck,
        Countries: data.countries,
        AgeCheck: data.ageGroup,
        MinAge: data.minAge,
        MaxAge: data.maxAge,
        GenderCheck: data.genderCheck,
        Gender: data.gender,
        LoginCounterCheck: data.loginCounter,
        MinLoginCount: data.minLoginCount,
        MaxLoginCount: data.maxLoginCount,
        RefCheck: data.referral,
        RefMin: data.minReferral,
        RefMax: data.maxReferral,
        MoneyDepositCheck: data.moneyDeposit,
        MinMonDep: data.minDeposit,
        MaxMonDep: data.maxDeposit,
        MoneyWonCheck: data.moneyWon,
        MinMonWon: data.minWon,
        MaxMonWon: data.maxWon,
        MoneyLossCheck: data.moneyLoss,
        MinMonLoss: data.minLoss,
        MaxMonLoss: data.maxLoss
      };

      let apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.SEGMENTATION.ADD_EDIT}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: apiBodyData
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error addEditSegmentationList: ', err);
    }
  },
  getCountries: async () => {
    try {
      let apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.SEGMENTATION.COUNTRY_LIST}`;

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
      console.log('Error getCountries: ', err);
    }
  },
  changeSegmentationStatus: async (uid) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.SEGMENTATION.CHANGE_STATUS,
        ':segmentationUID',
        uid
      );

      let apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

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
      console.log('Error changeSegmentationStatus: ', err);
    }
  },
  refreshSegmentationList: async (uid) => {
    try {
      const apiBodyData = {
        UID: uid,
        IsRefresh: true
      };

      let apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.SEGMENTATION.ADD_EDIT}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: apiBodyData
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error addEditSegmentationList: ', err);
    }
  }
};

export default SegmentationService;
