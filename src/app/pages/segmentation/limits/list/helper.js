import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const segmentationLimitListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  const list = apiData?.data?.map((item) => {
    return {
      id: item?.SegmentationLimitID,
      segmentationLimitUID: item?.SegmentationLimitUID,
      segmentationID: item?.SegmentationID,
      limitType: item?.LimitType,
      limitPeriod: item?.LimitPeriod,
      limitAmount: item?.LimitAmount,
      status: segmentationLimitStatusToAPP(item?.IsActive),
      createdAt: getDateInUTCToTimeZone(item?.DateCreated),
      updatedAt: getDateInUTCToTimeZone(item?.DateModified)
    };
  });
  return { list, totalRecords };
};

export const segmentationLimitStatusToAPP = (status) => {
  if (status == 0) {
    return 'inactive';
  } else if (status == 1) {
    return 'active';
  }
};
export const segmentationLimitStatusToAPI = (status) => {
  if (status == 'inactive') {
    return 0;
  } else if (status == 'active') {
    return 1;
  }
};

export const segmentationLimitOptions = [
  {
    key: 'active',
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    key: 'inactive',
    value: 'inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  }
];
