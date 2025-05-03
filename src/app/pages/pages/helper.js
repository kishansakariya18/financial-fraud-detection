import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import { getDateInUTCToTimeZone } from 'helpers/functions';

export const pagesListResponseMapper = (apiData) => {
  const totalRecords = apiData?.total_record;
  let i = 1;
  const list = apiData?.data?.map((item) => {
    return {
      srn: i++,
      id: item?.PageID,
      name: item?.Name,
      status: pagesStatusToAPP(item?.Status)
    };
  });
  return { list, totalRecords };
};
export const pagesStatusToAPP = (status) => {
  if (status == 0) {
    return 'inactive';
  } else if (status == 1) {
    return 'active';
  }
};
export const pagesStatusToAPI = (status) => {
  if (status == 'inactive') {
    return 0;
  } else if (status == 'active') {
    return 1;
  }
};

export const pagesOptions = [
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
