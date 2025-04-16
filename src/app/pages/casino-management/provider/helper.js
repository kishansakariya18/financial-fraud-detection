import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

import { getDateInUTCToTimeZone } from 'helpers/functions';
import { getImageURL } from 'utils/showImage';

export const parseProviderStatusToApi = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
    default:
      return undefined;
  }
};
export const parseProviderStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'active';
    case 0:
      return 'inactive';
    default:
      return undefined;
  }
};
export const responseMapper = (apiData) => {
  return apiData.map((item) => ({
    id: item.ID,
    providerUID: item.ProviderUID,
    name: item.Name,
    image: item.Image ? getImageURL('providers', item.Image) : null,
    status: parseProviderStatusToApp(item.Status),
    createdAt: getDateInUTCToTimeZone(item.DateCreated),
    updatedAt: getDateInUTCToTimeZone(item.DateModified)
  }));
};
export const restrictedCountryMapper = (apiData) => {
  return apiData.map((item) => ({
    id: item.CountryID,
    name: item?.country?.CountryName
  }));
};
export const countryMapper = (apiData) => {
  return apiData.map((item) => ({
    id: item.CountryID,
    name: item?.CountryName
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
