import { getDateInUTCToTimeZone } from 'helpers/functions';

export const segmentationLimitListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  const list = apiData?.data?.map((item) => {
    return {
      id: item?.SegmentationLimitID,
      segmentationLimitUID: item?.SegmentationLimitUID,
      userClassLimitUID: item?.UserClassLimitUID,
      limitType: item?.LimitType,
      limitPeriod: item?.LimitPeriod,
      limitAmount: item?.LimitAmount,
      currencyCode: item?.CurrencyCode,
      status: item?.Status,
      createdAt: getDateInUTCToTimeZone(item?.DateCreated),
      updatedAt: getDateInUTCToTimeZone(item?.DateModified)
    };
  });
  return { list, totalRecords };
};

export const segmentationLimitDetailResponseMapper = (apiResponse) => {
  if (!apiResponse?.data) return null;

  return {
    status: apiResponse.status,
    limitType: apiResponse.data.LimitType,
    limitPeriod: apiResponse.data.LimitPeriod,
    limitAmount: apiResponse.data.LimitAmount,
    currencyCode: apiResponse.data.CurrencyCode || '',
    isActive: apiResponse.data.IsActive === 1 ? 'active' : 'inactive'
  };
};

export const userclassLimitCreateResponseMapper = (apiResponse) => {
  if (!apiResponse?.data) return null;

  return {
    status: apiResponse.status,
    message: apiResponse.message
  };
};

export const userclassLimitStatusToAPP = (status) => {
  if (status === 0) {
    return 'inactive';
  } else if (status === 1) {
    return 'active';
  }
};

export const userclassLimitStatusToAPI = (status) => {
  if (status === 'inactive') {
    return 0;
  } else if (status === 'active') {
    return 1;
  }
};

export default {
  segmentationLimitListResponseMapper,
  segmentationLimitDetailResponseMapper
};
