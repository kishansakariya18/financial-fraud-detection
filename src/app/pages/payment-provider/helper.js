import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.GatewayID,
    uid: data.GatewayUID,
    gatewayName: data.Name,
    status: pagesStatusToAPP(data.IsActive)
  }));
  console.log('after helper data is ', resultData);

  return resultData;
};

export const pagesStatusToAPP = (status) => {
  if (status === 0) {
    return 'inactive';
  } else if (status === 1) {
    return 'active';
  }
};

export const gatewayStatusToAPI = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
  }
};

export const providerStatusOptions = [
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
