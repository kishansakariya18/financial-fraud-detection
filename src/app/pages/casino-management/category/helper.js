import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { getImageURL } from 'utils/showImage';

export const parseAdminStatusToApp = (status) => (status ? 'active' : 'inactive');

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.CategoryID,
    name: data.Name,
    image: data.ImageName ? getImageURL('category', data.ImageName) : null,
    status: parseAdminStatusToApp(data.IsActive),
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    updatedAt: getDateInUTCToTimeZone(data.DateModified)
  }));
  return resultData;
};

export const parseCategoryStatusToApi = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
    default:
      return undefined;
  }
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

export const categoryGameMapper = (apiData) => {
  return apiData.map((item) => ({
    id: item.GameID,
    name: item?.game?.Name
  }));
};

export const gameMapper = (apiData) => {
  return apiData.map((item) => ({
    id: item.GameID,
    name: item?.Name
  }));
};
