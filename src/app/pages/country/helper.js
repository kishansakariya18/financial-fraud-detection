import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const parseAdminStatusToApp = (status) => (status ? 'active' : 'inactive');

export const parseAdminStatusToApi = (status) => {
  let apiStatus = null;
  if (status === 'inactive') {
    apiStatus = 0;
  } else if (status === 'active') {
    apiStatus = 1;
  }
  return apiStatus;
};

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.CountryID,
    countryName: data.CountryName,
    countryCode: data.CountryCode,
    status: parseAdminStatusToApp(data.IsActive),
    globallyBlocked: data.GloballyBlocked ? 'blocked' : 'not_blocked',
    blockedModules: data.BlockedModules.map((module) => module.ModuleName).join(', ')
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

export const globallyBlockedStatusOptions = [
  {
    value: 'blocked',
    label: 'Blocked',
    color: 'error',
    icon: XCircleIcon
  },
  {
    value: 'not_blocked',
    label: 'Not Blocked',
    color: 'success',
    icon: CheckBadgeIcon
  }
];
