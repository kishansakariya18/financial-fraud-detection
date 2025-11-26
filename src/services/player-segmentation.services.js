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

  // Log APIs
  getChangeLog: async (page = 1, perPage = 10, filters = {}, segmentationUID) => {
    const requestData = { filters: {} };

    if (filters.keyword) {
      requestData.filters.keyword = filters.keyword;
    }
    if (filters.segmentationUID) {
      requestData.filters.segmentationUID = filters.segmentationUID;
    }
    if (filters.startDate) {
      requestData.filters.startDate = moment(+filters.startDate).startOf('day').toDate();
    }
    if (filters.endDate) {
      requestData.filters.endDate = moment(+filters.endDate).endOf('day').toDate();
    }

    return apiInstance.post(
      `${apiConfig.endPoints.PLAYER_SEGMENTATION.CHANGE_LOG?.replace(':segmentationUID', segmentationUID)}?page=${page}&per_page=${perPage}`,
      requestData
    );
  },

  archive: async (segmentationUID) => {
    const url = apiConfig.endPoints.PLAYER_SEGMENTATION.ARCHIVE.replace(
      ':segmentationUID',
      segmentationUID
    );
    return apiInstance.patch(url);
  },

  getExecutionLog: async (page = 1, perPage = 10, filters = {}) => {
    const requestData = { filters: {} };

    if (filters.evaluationType) {
      requestData.filters.evaluationType = filters.evaluationType;
    }
    if (filters.startDate) {
      requestData.filters.startDate = moment(+filters.startDate).startOf('day').toDate();
    }
    if (filters.endDate) {
      requestData.filters.endDate = moment(+filters.endDate).endOf('day').toDate();
    }

    return apiInstance.post(
      `${apiConfig.endPoints.PLAYER_SEGMENTATION.EXECUTION_LOG}?page=${page}&per_page=${perPage}`,
      requestData
    );
  },

  getMapChangeLog: async (segmentationUID, page = 1, perPage = 10, filters = {}) => {
    const requestData = { filters: {} };

    if (filters.keyword) {
      requestData.filters.keyword = filters.keyword;
    }
    if (filters.userId) {
      requestData.filters.userId = filters.userId;
    }
    if (filters.segmentationUID) {
      requestData.filters.segmentationUID = filters.segmentationUID;
    }
    if (filters.startDate) {
      requestData.filters.startDate = moment(+filters.startDate).startOf('day').toDate();
    }
    if (filters.endDate) {
      requestData.filters.endDate = moment(+filters.endDate).endOf('day').toDate();
    }

    const url = apiConfig.endPoints.PLAYER_SEGMENTATION.MAP_CHANGE_LOG.replace(
      ':segmentationUID',
      segmentationUID
    );

    return apiInstance.post(`${url}?page=${page}&per_page=${perPage}`, requestData);
  }
};

export default PlayerSegmentationService;
