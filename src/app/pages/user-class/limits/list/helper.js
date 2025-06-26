import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const userclassLimitListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  const list = apiData?.data?.map((item) => {
    return {
      id: item?.UserClassLimitID,
      userClassID: item?.UserClassID,
      userClassLimitUID: item?.UserClassLimitUID,
      limitName: item?.LimitName,
      limitValue: item?.LimitValue,
      period: item?.Period,
      status: userclassLimitStatusToAPP(item?.IsActive),
      createdAt: getDateInUTCToTimeZone(item?.DateCreated),
      dateModified: getDateInUTCToTimeZone(item?.DateModified),
      admin: item?.admin?.Username
    };
  });
  return { list, totalRecords };
};

export const userclassLimitStatusToAPP = (status) => {
  if (status == 0) {
    return 'inactive';
  } else if (status == 1) {
    return 'active';
  }
};
export const userclassLimitStatusToAPI = (status) => {
  if (status == 'inactive') {
    return 0;
  } else if (status == 'active') {
    return 1;
  }
};

export const userclassLimitOptions = [
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
