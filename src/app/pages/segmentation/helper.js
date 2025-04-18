import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const segmentationResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.Id,
    name: data.Name,
    count: data?.Count || '0',
    status: parseSegmentationStatusToAPP(data?.Status),
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
  return resultData;
};

export const parseSegmentationStatusToAPP = (status) => {
  switch (+status) {
    case 0:
      return 'inactive';
    case 1:
      return 'active';
  }
};
export const parseSegmentationStatusToAPI = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
  }
};

export const segmentationStatusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  }
];

export const kycOptions = [
  { value: 1, label: 'Only Document' },
  { value: 2, label: 'Only Bank' },
  { value: 3, label: 'Both Verified' },
  { value: 4, label: 'Both Not Verified' }
];

export const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' }
];
