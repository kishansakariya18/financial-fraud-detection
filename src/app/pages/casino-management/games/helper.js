import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

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
    name: item.Name,
    minBetAmount: item.MinBetAmount || '-',
    maxBetAmount: item.MaxBetAmount || '-',
    provider: item?.provider?.Name || '-',
    aggregatorCategory: item?.aggregatorCategory?.Name || '-',
    status: parseProviderStatusToApp(item.Status),
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
