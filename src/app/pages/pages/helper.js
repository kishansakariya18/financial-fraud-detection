import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import { getDateInUTCToTimeZone } from 'helpers/functions';

export const pagesListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  const list = apiData?.data?.map((item) => {
    return {
      id: item?.PageID,
      name: item?.Name,
      status: item?.IsActive
    };
  });
  return { list, totalRecords };
};
export const pagesStatusToAPP = (status) => {
  if (status === 'Inactive') {
    return 'inactive';
  } else if (status === 'Active') {
    return 'active';
  }
};
export const pagesStatusToAPI = (status) => {
  if (status == 'inactive') {
    return 'Inactive';
  } else if (status == 'active') {
    return 'Active';
  }
};

export const pagesOptions = [
  {
    key: 'active',
    value: 'Active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    key: 'inactive',
    value: 'Inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  }
];
