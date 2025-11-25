import { statusToAPI } from 'app/pages/player-segmentation/hapler';
import apiConfig from 'configs/api.config';
import moment from 'moment-timezone';
import apiInstance from 'utils/apiInstance';

const PlayerSegmentationService = {
  list: async (page = 1, perPage = 10, filters = {}) => {
    const requestData = {
      filters: {}
    };

    // Add filters if provided
    if (filters.keyword) {
      requestData.filters.keyword = filters.keyword;
    }
    if (filters.status !== undefined && filters.status !== '') {
      requestData.filters.status = statusToAPI(filters.status);
    }
    if (filters.startDate) {
      requestData.filters.startDate = moment(+filters.startDate).startOf('day').toDate();
    }
    if (filters.endDate) {
      requestData.filters.endDate = moment(+filters.endDate).endOf('day').toDate();
    }

    return apiInstance.post(
      `${apiConfig.endPoints.PLAYER_SEGMENTATION.LIST}?page=${page}&per_page=${perPage}`,
      requestData
    );
  },

  add: async (requestData) => {
    return apiInstance.post(apiConfig.endPoints.PLAYER_SEGMENTATION.ADD, requestData);
  },

  edit: async (requestData) => {
    return apiInstance.post(apiConfig.endPoints.PLAYER_SEGMENTATION.EDIT, requestData);
  },

  detail: async (segmentationUID) => {
    const url = apiConfig.endPoints.PLAYER_SEGMENTATION.DETAIL.replace(
      ':segmentationUID',
      segmentationUID
    );
    return apiInstance.get(url);
  },

  changeStatus: async (segmentationUID) => {
    const url = apiConfig.endPoints.PLAYER_SEGMENTATION.CHANGE_STATUS.replace(
      ':segmentationUID',
      segmentationUID
    );
    return apiInstance.get(url);
  },

  refresh: async (segmentationUID) => {
    const url = apiConfig.endPoints.PLAYER_SEGMENTATION.REFRESH.replace(
      ':segmentationUID',
      segmentationUID
    );
    return apiInstance.get(url);
  },

  getPlayerList: async (segmentationUID, page = 1, perPage = 10, filters = {}) => {
    const requestData = {
      filters
    };

    const url = apiConfig.endPoints.PLAYER_SEGMENTATION.PLAYER_LIST.replace(
      ':segmentationUID',
      segmentationUID
    );

    return apiInstance.post(`${url}?page=${page}&perPage=${perPage}`, requestData);
  },

  playerPreview: async ({ segmentationUID, segmentRules }) => {
    const data = {
      SegmentationUID: segmentationUID,
      SegmentRules: segmentRules
    };
    return apiInstance.post(apiConfig.endPoints.PLAYER_SEGMENTATION.PLAYER_PREVIEW, data);
  },

  duplicate: async (segmentationUID) => {
    // First, fetch the details of the segmentation to duplicate
    const detailUrl = apiConfig.endPoints.PLAYER_SEGMENTATION.DETAIL.replace(
      ':segmentationUID',
      segmentationUID
    );
    const detailResponse = await apiInstance.get(detailUrl);

    if (!detailResponse?.response?.data) {
      throw new Error('Failed to fetch segmentation details');
    }

    const originalData = detailResponse.response.data;

    // Create a copy with modified data
    const duplicateData = {
      SegmentName: `[Copy] ${originalData.SegmentName}`,
      SegmentDescription: originalData.SegmentDescription || '',
      SegmentTag: originalData.SegmentTag || '',
      SegmentRules: originalData.SegmentRules,
      IsScheduled: originalData.IsScheduled,
      EvaluationFrequency: originalData.EvaluationFrequency || 'NONE',
      IsActive: false // Set to inactive
    };

    // Use the add method to create the duplicate
    return PlayerSegmentationService.add(duplicateData);
  }
};

export default PlayerSegmentationService;
