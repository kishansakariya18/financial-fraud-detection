import { getDateInUTCToTimeZone } from 'helpers/functions';

export const userclassLimitListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  const list = apiData?.data?.map((item) => {
    return {
      id: item?.UserClassLimitID,
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
  userclassLimitListResponseMapper,
  userclassLimitStatusToAPP,
  userclassLimitStatusToAPI
};
