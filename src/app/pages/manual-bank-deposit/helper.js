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
  if (!apiData) return [];
  const resultData = apiData.map((data) => ({
    id: data.DepositBankAccountUID,
    bankName: data.BankName,
    accountHolderName: data.AccountHolderName,
    accountNumber: data.AccountNumber,
    bankCode: data.BankCode,
    upiId: data.UPIID,
    status: bankStatusToAPP(data.IsActive)
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
export const bankStatusToAPI = (status) => {
  if (status == 'inactive') {
    return 0;
  } else if (status == 'active') {
    return 1;
  }
};
export const bankStatusToAPP = (status) => {
  if (status == 0) {
    return 'inactive';
  } else if (status == 1) {
    return 'active';
  }
};
