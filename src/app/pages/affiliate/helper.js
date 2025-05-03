import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { HiXCircle } from 'react-icons/hi';
import { playerStatusToApp, transactionStatusToAPP } from '../users/player/helper';
import { PAYOUT_STATUS, TRANSACTION } from 'constants/app.constant';

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
      status: affiliateStatusToApp(item.AccountStatus),
      createdAt: getDateInUTCToTimeZone(item.DateCreated)
    };
  });
  const totalPage = apiData.totalPages;
  const totalRecords = apiData.totalRecords;
  return { totalPage, totalRecords, list };
};

export const playerListResponseMapper = (apiData) => {
  console.log('apiData', apiData);
  const list = apiData.map((item) => {
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
      status: playerStatusToApp(item.Status),
      createdAt: item.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '-',
      lastLoginAt: item.LastLoginAt ? getDateInUTCToTimeZone(item.LastLoginAt) : '-',
      isBankVerified: item.IsBankVerified ? 'Yes' : 'No'
    };
  });
  const totalPage = apiData.totalPages;
  const totalRecords = apiData.totalRecord;
  return { totalPage, totalRecords, list };
};

export const transactionResponseMapper = (apiData) => {
  const list = apiData.data.map((item) => {
    return {
      id: item.AffiliateTransactionID,
      transactionUID: item.AffiliateTransactionUID,
      userName: item?.user?.Username || '-',
      mobile: item?.user?.Mobile || '-',
      email: item?.user?.Email || '-',
      description: transactionTypeToDescription(item?.TransactionType),
      status: transactionStatusToAPP(item?.TransactionStatus),
      type: transactionTypeApiToApp(item?.CreditDebitType),
      amount: item.SourceAmount,
      commission: item.CommissionAmount,
      transactionType: affiliateTransactionTypeToAPP(item.TransactionType),
      createdAt: getDateInUTCToTimeZone(item.DateCreated)
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

export const loginHistoryResponseMapper = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.AffiliateLoginHistoryID,
      adminId: data.AdminID,
      ip: data.IPAddress,
      userAgent: data.UserAgent,
      expiredAt: data.ExpiredAt,
      loginAt: data.DateCreated
    };
  });
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
  if (+status === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_SIGNUP) {
    return 'signup';
  } else if (+status === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_DEPOSIT) {
    return 'deposit';
  } else if (+status === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_LOSS) {
    return 'userLoss';
  } else if (+status === TRANSACTION.TRANSACTION_TYPE.SYSTEM) {
    return 'system';
  } else if (+status === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_PAYOUT) {
    return 'payout';
  }
  return '-';
};

export const affiliateTransactionTypeToAPP = (type) => {
  if (+type === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_SIGNUP) {
    return 'signup';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_DEPOSIT) {
    return 'deposit';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_LOSS) {
    return 'userLoss';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.SYSTEM) {
    return 'system';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.AFFILIATE_PAYOUT) {
    return 'payout';
  }
};

export const affiliateTransactionToAPI = (type) => {
  switch (type) {
    case 'signup':
      return TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_SIGNUP;
    case 'deposit':
      return TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_DEPOSIT;
    case 'userLoss':
      return TRANSACTION.TRANSACTION_TYPE.AFFILIATE_COMMISION_ON_USER_LOSS;
    case 'system':
      return TRANSACTION.TRANSACTION_TYPE.SYSTEM;
    case 'payout':
      return TRANSACTION.TRANSACTION_TYPE.AFFILIATE_PAYOUT;
    default:
      return null;
  }
};

export const affiliateTransactionTypeOption = [
  {
    value: 'signup',
    label: 'SignUp'
  },
  {
    value: 'deposit',
    label: 'Deposit'
  },
  {
    value: 'userLoss',
    label: 'User Loss'
  }
];

export const payoutHistoryResponseMapper = (data) => {
  return data.map((apiData) => {
    return {
      id: apiData.AffiliatePayoutRequestID,
      amount: apiData.PayoutTransaction.CommissionAmount,
      requestedAt: getDateInUTCToTimeZone(apiData.DateCreated),
      updatedAt: getDateInUTCToTimeZone(apiData.DateModified),
      rejectReason: apiData.RejectReason || '-',
      status: parsePayoutStatusToApp(apiData.PayoutRequestStatus),
      transactionStatus: parsePayoutTxnStatusToApp(apiData.PayoutTransaction.TransactionStatus)
    };
  });
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

const parsePayoutStatusToApp = (status) => {
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
export const parsePayoutTxnStatusToApi = (status) => {
  switch (status) {
    case 'success':
      return 1;
    case 'failure':
      return 2;
    case 'pending':
      return 0;
    default:
      return -1; // or null, depending on how you want to handle invalid input
  }
};

export const payoutTxnStatusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning'
  },
  {
    value: 'failure', // or 'rejected' if you're using that term in your app
    label: 'Failure',
    color: 'error'
  },
  {
    value: 'success',
    label: 'Success',
    color: 'success'
  }
];

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
    Balance: data.CommissionBalance
  };
};

export const transactionTypeApiToApp = (status) => {
  if (+status === 0) {
    return 'credit';
  } else if (+status === 1) {
    return 'debit';
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
