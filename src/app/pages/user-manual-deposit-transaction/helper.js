import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { PAYOUT_STATUS } from 'constants/app.constant';

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
    id: data.UserBankDepositUID,
    userID: data.UserID,
    depositBankAccountID: data.DepositBankAccountID,
    amount: data.Amount,
    depositTime: data.DepositTime,
    depositStatus: parsePayoutStatusToApp(data.DepositStatus),
    bankTransactionID: data.BankTransactionID,
    dateCreated: data.DateCreated,
    dateModified: data.DateModified,
    status: data.IsActive,
    currencyCode: data.currencyCode
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
export const userManualDepositTransactionStatusToAPP = (status) => {
  if (status == 0) {
    return 'inactive';
  } else if (status == 1) {
    return 'active';
  }
};
export const payoutStatusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning'
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: 'error'
  },
  {
    value: 'approved',
    label: 'Approved',
    color: 'success'
  }
];

export const parsePayoutStatusToAPI = (status) => {
  switch (status) {
    case 'pending':
      return PAYOUT_STATUS.PENDING;
    case 'rejected':
      return PAYOUT_STATUS.REJECTED;
    case 'approved':
      return PAYOUT_STATUS.APPROVED;
    default:
      break;
  }
};

export const parsePayoutStatusToApp = (status) => {
  switch (+status) {
    case PAYOUT_STATUS.APPROVED:
      return 'approved';
    case PAYOUT_STATUS.REJECTED:
      return 'rejected';
    case PAYOUT_STATUS.PENDING:
      return 'pending';
    default:
      break;
  }
};
