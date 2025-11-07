import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from '../../../helpers/functions';

export const parseBlogCategoryStatusToApp = (status) => (status === 1 ? 'active' : 'inactive');

export const parseBlogCategoryStatusToApi = (status) => {
  let apiStatus = null;
  if (status === 'inactive') {
    apiStatus = 0;
  } else if (status === 'active') {
    apiStatus = 1;
  }
  return apiStatus;
};

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.BlogCategoryID,
    categoryId: data.BlogCategoryID,
    name: data.Name,
    imageName: data.ImageName,
    isActive: data.IsActive === 1,
    status: parseBlogCategoryStatusToApp(data.IsActive),
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    updatedAt: getDateInUTCToTimeZone(data.DateModified)
  }));
  return resultData;
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
