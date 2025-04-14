import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const parseAdminStatusToApp = (status) => (status ? 'active' : 'inactive');

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.ID,
    name: data.Name,
    status: parseAdminStatusToApp(data.Status),
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
