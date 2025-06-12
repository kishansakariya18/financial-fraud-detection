import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const userclassListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  const list = apiData?.data?.map((item) => {
    return {
      userClassId: item?.UserClassID,
      className: item?.ClassName,
      classCode: item?.ClassCode,
      priority: item?.Priority,
      avatarUrl: item?.AvatarURL,
      status: userclassStatusToAPP(item?.IsActive),
      createdAt: getDateInUTCToTimeZone(item?.DateCreated),
      dateModified: getDateInUTCToTimeZone(item?.DateModified),
      admin: item?.admin?.Username
    };
  });
  return { list, totalRecords };
};

export const userclassStatusToAPP = (status) => {
  if (status == 0) {
    return 'inactive';
  } else if (status == 1) {
    return 'active';
  }
};
export const userclassStatusToAPI = (status) => {
  if (status == 'inactive') {
    return 0;
  } else if (status == 'active') {
    return 1;
  }
};

export const userclassOptions = [
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
