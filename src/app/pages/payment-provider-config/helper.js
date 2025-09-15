import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const paymentProviderResponseMapper = (apiData) => {
  const list = apiData?.map((item) => {
    return {
      id: item?.GatewayID,
      uid: item?.GatewayUID,
      provider: item?.Name,
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

export const paymentProviderStatusOptions = [
  { value: 'active', label: 'Active', color: 'success', icon: CheckBadgeIcon },
  { value: 'inactive', label: 'Inactive', color: 'error', icon: XCircleIcon }
];
