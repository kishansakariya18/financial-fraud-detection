import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

import { getDateInUTCToTimeZone } from 'helpers/functions';
import { getImageURL } from 'utils/showImage';

export const parseAggregatorStatusToApi = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
    default:
      return undefined;
  }
};

export const parseAggregatorStatusToApp = (status) => {
  if (status === 1 || status === true) {
    return 'active';
  }
  if (status === 0 || status === false) {
    return 'inactive';
  }
  return undefined;
};

export const responseMapper = (apiData = []) => {
  return apiData.map((item) => ({
    id: item.AggregatorID,
    name: item.Name,
    image: item.Image ? getImageURL('aggregators', item.Image) : null,
    status: parseAggregatorStatusToApp(item.IsActive),
    createdAt: getDateInUTCToTimeZone(item.DateCreated),
    updatedAt: getDateInUTCToTimeZone(item.DateModified)
  }));
};

export const statusOptions = [
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
