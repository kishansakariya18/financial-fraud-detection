import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { HiXCircle } from 'react-icons/hi';

export const affiliateListResponseMapper = (apiData) => {
  const list = apiData.map((item) => {
    return {
      id: item.AffiliatesID,
      affiliateUID: item.AffiliatesUID,
      email: item.Email || '-',
      referralCode: item.ReferralCode,
      firstName: item.FirstName,
      lastName: item.LastName,
      username: item.Username,
      mobile: item.Mobile || '-',
      status: affiliateStatusToApp(item.Status),
      createdAt: getDateInUTCToTimeZone(item.DateCreated)
    };
  });
  const totalPage = apiData.totalPages;
  const totalRecords = apiData.totalRecords;
  return { totalPage, totalRecords, list };
};

export const userListResponseMapper = (apiData) => {
  const list = apiData.data.map((item) => {
    return {
      userID: item.UserID,
      userUID: item.UserUID,
      email: item.Email || '-',
      referralCode: item.ReferralCode,
      firstName: item.FirstName,
      lastName: item.LastName,
      username: item.Username,
      mobile: item.Mobile || '-',
      realCash: item.RealCash,
      realCashAmount: item.RealCashAmount,
      bonus: item.Bonus,
      winning: item.Winning,
      coin: item.Coin,
      cryptoDeposit: item.CryptoDeposit,
      cryptoWinning: item.CryptoWinning,
      status: affiliateStatusToApp(item.Status),
      dateCreated: getDateInUTCToTimeZone(item.DateCreated),
      lastLoginAt: item.LastLoginAt ? getDateInUTCToTimeZone(item.LastLoginAt) : '-',
      isBankVerified: item.IsBankVerified
    };
  });
  const totalPage = apiData.totalPages;
  const totalRecords = apiData.totalRecord;
  return { totalPage, totalRecords, list };
};

export const transactionResponseMapper = (apiData) => {
  const list = apiData.data.map((item) => {
    return {
      userName: item?.user?.Username || '-',
      mobile: item?.user?.Mobile || '-',
      email: item?.user?.Email || '-',
      description: transactionTypeToDescription(item?.TransactionType),
      type: transactionTypeApiToApp(item?.Type),
      amount: item.Amount,
      commission: item.Commission,
      dateCreated: getDateInUTCToTimeZone(item.DateCreated)
    };
  });
  const totalPage = apiData.totalPages;
  const totalRecords = apiData.totalRecord;
  const totalSignup = apiData.totalSignup;
  const totalDeposit = apiData.totalDeposit;
  const totalCommission = apiData.totalCommission;
  const affiliateData = apiData.affiliateData;
  return {
    totalPage,
    totalRecords,
    totalSignup,
    totalDeposit,
    totalCommission,
    affiliateData,
    list
  };
};

export const affiliateStatusToApp = (status) => {
  if (+status === 0) {
    return 'inactive';
  } else if (+status === 1) {
    return 'active';
  } else {
    return 'blocked';
  }
};

export const affiliateStatusToApi = (status) => {
  switch (status) {
    case 'inactive':
      return 0;
    case 'active':
      return 1;
    case 'blocked':
    default:
      return 2;
  }
};

export const affiliateStatusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'warning',
    icon: XCircleIcon
  },
  {
    value: 'blocked',
    label: 'Blocked',
    color: 'error',
    icon: HiXCircle
  }
];

export const transactionTypeToDescription = (status) => {
  if (+status === 8) {
    return 'Signup';
  } else if (+status === 10) {
    return 'Deposit';
  } else if (+status === 11) {
    return 'User Loss';
  } else if (+status === 0) {
    return 'System';
  }
  return '-';
};

export const payoutHistoryResponseMapper = (data) => {
  return data.map((apiData) => {
    return {
      id: apiData.ID,
      amount: apiData.PayoutTransaction.Commission,
      requestedAt: getDateInUTCToTimeZone(apiData.DateCreated),
      updatedAt: getDateInUTCToTimeZone(apiData.DateModified),
      rejectReason: apiData.RejectReason,
      status: parsePayoutStatusToApp(apiData.Status),
      transactionStatus: parsePayoutTxnStatusToApp(apiData.PayoutTransaction.Status)
    };
  });
};

export const parsePayoutStatusToAPI = (status) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'rejected':
      return 2;
    case 'approved':
      return 1;
    default:
      break;
  }
};

const parsePayoutStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'approved';
    case 2:
      return 'rejected';
    case 0:
      return 'pending';
    default:
      break;
  }
};
const parsePayoutTxnStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'success';
    case 2:
      return 'failure';
    case 0:
      return 'pending';
    default:
      break;
  }
};

// export const getBadgeDesignForApprovalStatus = (status) => {
//   switch (status) {
//     case 'pending':
//       return <span className="badge badge-warning">{status}</span>;
//     case 'approved':
//       return <span className="badge badge-success">{status}</span>;
//     case 'rejected':
//       return <span className="badge badge-danger">{status}</span>;
//     default:
//       break;
//   }
// };
// export const getBadgeDesignForTransactionStatus = (status) => {
//   switch (status) {
//     case 'pending':
//       return <span className="badge badge-warning">{status}</span>;
//     case 'success':
//       return <span className="badge badge-success">{status}</span>;
//     case 'failure':
//       return <span className="badge badge-danger">{status}</span>;
//     default:
//       break;
//   }
// };
export const affiliateDetailResponseMapper = (data) => {
  return {
    FirstName: data.FirstName,
    UserName: data.Username,
    LastName: data.LastName,
    Mobile: data.Mobile,
    Email: data.Email,
    Balance: data.Balance
  };
};

export const transactionTypeApiToApp = (status) => {
  if (+status === 0) {
    return 'Credit';
  } else if (+status === 1) {
    return 'Debit';
  }
};

export const depositCommissionTypeOptions = [
  { value: 0, label: 'Flat' },
  { value: 1, label: 'Percentage' }
];

export const playerLossCommissionTypeOptions = [
  { value: 0, label: 'Flat' },
  { value: 1, label: 'Percentage' }
];
