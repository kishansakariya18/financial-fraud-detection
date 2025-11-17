import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from '../../../helpers/functions';
import apiConfig from '../../../configs/api.config';

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

const buildImageUrl = (imageName) =>
  imageName ? `${apiConfig.baseURL.S3_URL}/blog-category/${imageName}` : null;

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.BlogCategoryID,
    categoryId: data.BlogCategoryID,
    name: data.Name,
    imageName: data.ImageName,
    imageUrl: buildImageUrl(data.ImageName),
    isActive: data.IsActive === 1,
    status: parseBlogCategoryStatusToApp(data.IsActive),
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    updatedAt: getDateInUTCToTimeZone(data.DateModified)
  }));
  console.log(resultData);
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
