import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const smsProviderResponseMapper = (apiData) => {
  const list = apiData?.map((item) => {
    return {
      id: item?.ProviderID,
      uid: item?.ProviderUID,
      provider: item?.ProviderName,
      status: statusToAPP(item?.IsActive)
    };
  });
  return list;
};

export const statusToAPP = (status) => {
  if (status == 0) {
    return 'inactive';
  } else if (status == 1) {
    return 'active';
  }
};
export const statusToAPI = (status) => {
  if (status == 'inactive') {
    return 0;
  } else if (status == 'active') {
    return 1;
  }
};

export const smsProviderStatusOptions = [
  { value: 'active', label: 'Active', color: 'success', icon: CheckBadgeIcon },
  { value: 'inactive', label: 'Inactive', color: 'error', icon: XCircleIcon }
];
