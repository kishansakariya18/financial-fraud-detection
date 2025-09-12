import { getDateInUTCToTimeZone } from 'helpers/functions';
import {
  ArchiveBoxIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { TRANSACTION } from 'constants/app.constant';

export const unassignedPlayersResponseMapper = (data) => {
  const list = data?.map((item) => {
    return {
      id: item.UserID,
      userID: item.UserID,
      userUID: item.UserUID,
      email: item.Email || '-',
      referralCode: item.ReferralCode,
      username: item.Username,
      mobile: item.Mobile || '-',
      realCash: item.RealCash,
      realCashAmount: item.RealCashAmount,
      bonus: item.Bonus,
      winning: item.Winning,
      coin: item.Coin,
      cryptoDeposit: item.CryptoDeposit,
      cryptoWinning: item.CryptoWinning,
      status: playerStatusToApp(item.AccountStatus),
      createdAt: item.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '',
      lastLoginAt: item.LastLoginAt ? getDateInUTCToTimeZone(item.LastLoginAt) : '',
      isBankVerified: playerBankVerifyToApp(item.isBankVerified),
      isKYCVerified: playerKycToApp(item.isKYCVerified),
      gender: item.Gender,
      country: item.CountryID,
      SegmentationID: '0',
      blockedAt: item?.UserBlockedAt ? getDateInUTCToTimeZone(item.UserBlockedAt) : ''
    };
  });
  return list;
};

export const playerStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'active';
    case 0:
      return 'inactive';
    case 2:
      return 'blocked';
    default:
      break;
  }
};
export const playerKycToApp = (kyc) => {
  switch (+kyc) {
    case 1:
      return 'verified';
    case 0:
      return 'not-verified';
    default:
      break;
  }
};
export const playerBankVerifyToApp = (bankStatus) => {
  switch (bankStatus) {
    case true:
      return 'verified';
    case false:
      return 'not-verified';
    default:
      break;
  }
};
export const playerKycToAPI = (kyc) => {
  switch (kyc) {
    case 'verified':
      return 1;
    case 'not-verified':
      return 0;
    default:
      return null;
  }
};

export const playerStatusToAPI = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
    case 'blocked':
      return 2;
    default:
      return null;
  }
};
export const playerStatusOptions = [
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
  },
  {
    value: 'blocked',
    label: 'Blocked',
    color: 'error',
    icon: ArchiveBoxIcon
  }
];
export const genderOptions = [
  {
    value: 'male',
    label: 'Male',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'female',
    label: 'Female',
    color: 'error',
    icon: XCircleIcon
  }
];
export const bankVerifiedOptions = [
  {
    value: 'verified',
    label: 'Verified',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'not-verified',
    label: 'Not Verified',
    color: 'error',
    icon: XCircleIcon
  }
];
export const bankVerifyOptionToAPI = (status) => {
  switch (status) {
    case 'verified':
      return 1;
    case 'not-verified':
      return 0;
    default:
      return null;
  }
};
export const panVerifyOptionToAPI = (status) => {
  switch (status) {
    case 'verified':
      return 1;
    case 'not-verified':
      return 0;
    default:
      return null;
  }
};
export const panVerifiedOptions = [
  {
    value: 'verified',
    label: 'Verified',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'not-verified',
    label: 'Not Verified',
    color: 'error',
    icon: XCircleIcon
  }
];
export const playerTransactionsResponseMapper = (apiData) => {
  const totalRecords = apiData.totalRecords;
  const userData = apiData?.data?.userData?.[0] || {};
  const list = apiData?.data?.transactionList?.map((item) => {
    const currencySymbol = item.Currency?.Symbol || '';
    const currencyName = item.Currency?.Name || '';

    return {
      id: item.TransactionID,
      transactionUID: item.TransactionUID,
      username: userData.Username,
      type: transactionTypeApiToApp(item.CreditDebitType),
      customMessage: '',
      realCash: item.TransactionAmount,
      bonus: item.Bonus,
      realCashAmount: item.TransactionAmount,
      transactionType: item.transactionType?.Name || 'Unknown',
      transactionMesg: item.transactionType?.Name || 'Unknown',
      winning: 0, // Not present in the new response
      coin: 0, // Not present in the new response
      currency: {
        symbol: currencySymbol,
        name: currencyName
      },
      baseCurrencyRate: item.BaseCurrencyRate,
      baseCurrencyValue: item.BaseCurrencyValue,
      createdAt: getDateInUTCToTimeZone(item.DateCreated),
      status: transactionStatusToAPP(item.TransactionStatus),
      transactionData: item.TransactionData,
      admin: item.admin
    };
  });
  return { totalRecords, list, userData };
};

export const transactionStatusToAPP = (status) => {
  if (+status == 0) {
    return 'pending';
  } else if (+status == 1) {
    return 'success';
  } else if (+status == 2) {
    return 'failed';
  }
};
export const transactionStatusToAPI = (status) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'success':
      return 1;
    case 'failed':
      return 2;
  }
};

export const transactionTypeApiToApp = (status) => {
  if (+status === 0) {
    return 'credit';
  } else if (+status === 1) {
    return 'debit';
  }
};
export const transactionTypeAppToApi = (status) => {
  if (status == 'credit') {
    return '0';
  } else if (status == 'debit') {
    return '1';
  }
};

// export const transactionTypeInWords = (type) => {
//   if (+type === TRANSACTION.TRANSACTION_TYPE.SYSTEM) {
//     return 'ADMIN SYSTEM';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.DEPOSIT) {
//     return 'DEPOSIT';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.WINNING) {
//     return 'WINNING';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.WITHDRAW) {
//     return 'WITHDRAW';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.DEPOSIT_TAX) {
//     return 'DEPOSIT TAX';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.WITHDRAW_TAX) {
//     return 'WITHDRAW TAX';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.BETSLIP) {
//     return 'BET SLIP';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.DEPOSIT_PROMO_CODE_BENEFIT) {
//     return 'PROMOCODE BENEFIT';
//   } else if (+type === TRANSACTION.TRANSACTION_TYPE.ROLLBACK) {
//     return 'ROLLBACK';
//   }
// };
export const transactionTypeInWords = (type) => {
  switch (+type) {
    case TRANSACTION.TRANSACTION_TYPE.SYSTEM:
      return 'ADMIN SYSTEM';
    case TRANSACTION.TRANSACTION_TYPE.DEPOSIT:
      return 'DEPOSIT';
    case TRANSACTION.TRANSACTION_TYPE.WITHDRAW:
      return 'WITHDRAW';
    case TRANSACTION.TRANSACTION_TYPE.WINNING:
      return 'WINNING';
    case TRANSACTION.TRANSACTION_TYPE.BETSLIP:
      return 'BET SLIP';
    case TRANSACTION.TRANSACTION_TYPE.WITHDRAW_TAX:
      return 'WITHDRAW TAX';
    case TRANSACTION.TRANSACTION_TYPE.DEPOSIT_TAX:
      return 'DEPOSIT TAX';
    case TRANSACTION.TRANSACTION_TYPE.DEPOSIT_PROMO_CODE_BENEFIT:
      return 'PROMOCODE BENEFIT';
    case TRANSACTION.TRANSACTION_TYPE.REFERRAL_SIGNUP_BONUS:
      return 'REFERRAL SIGNUP BONUS';
    case TRANSACTION.TRANSACTION_TYPE.WITHOUT_REFERRAL_SIGNUP_BONUS:
      return 'WITHOUT REFERRAL SIGNUP BONUS';
    case TRANSACTION.TRANSACTION_TYPE.REFERRAL_PAN_VERIFICATION:
      return 'REFERRAL PAN VERIFICATION';
    case TRANSACTION.TRANSACTION_TYPE.REFERRAL_BANK_VERIFICATION:
      return 'REFERRAL BANK VERIFICATION';
    case TRANSACTION.TRANSACTION_TYPE.WITHOUT_REFERRAL_PAN_VERIFICATION:
      return 'NO REFERRAL PAN VERIFICATION';
    case TRANSACTION.TRANSACTION_TYPE.WITHOUT_REFERRAL_BANK_VERIFICATION:
      return 'NO REFERRAL BANK VERIFICATION';
    case TRANSACTION.TRANSACTION_TYPE.ROLLBACK:
      return 'ROLLBACK';
    default:
      return 'UNKNOWN';
  }
};

export const transactionStatusOption = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning',
    icon: ClockIcon
  },
  {
    value: 'success',
    label: 'Success',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'failed',
    label: 'Failed',
    color: 'error',
    icon: XCircleIcon
  }
];

export const transactionTypeOption = [
  {
    value: 'credit',
    label: 'Credit',
    color: 'success'
  },
  {
    value: 'debit',
    label: 'Debit',
    color: 'warning'
  }
];

export const txnTypeOption = [
  {
    value: 'ADMIN_SYSTEM',
    label: 'Admin System',
    color: 'success'
  },
  {
    value: 'DEPOSIT',
    label: 'Deposit',
    color: 'primary'
  },
  {
    value: 'WINNING',
    label: 'Winning',
    color: 'success'
  },
  {
    value: 'WITHDRAW',
    label: 'Withdraw',
    color: 'danger'
  },
  {
    value: 'BET SLIP',
    label: 'Bet Slip',
    color: 'info'
  },
  {
    value: 'PROMOCODE BENEFIT',
    label: 'Promocode Benefit',
    color: 'success'
  },
  {
    value: 'REFERRAL SIGNUP BONUS',
    label: 'Referral Signup Bonus',
    color: 'success'
  },
  {
    value: 'WITHOUT REFERRAL SIGNUP BONUS',
    label: 'Without Referral Signup Bonus',
    color: 'success'
  },
  {
    value: 'ROLLBACK',
    label: 'RollBack',
    color: 'success'
  }
];

export const txnTypeToAPI = (value) => {
  switch (value) {
    case 'ADMIN_SYSTEM':
      return TRANSACTION.TRANSACTION_TYPE.SYSTEM;
    case 'DEPOSIT':
      return TRANSACTION.TRANSACTION_TYPE.DEPOSIT;
    case 'WITHDRAW':
      return TRANSACTION.TRANSACTION_TYPE.WITHDRAW;
    case 'WINNING':
      return TRANSACTION.TRANSACTION_TYPE.WINNING;
    case 'BET SLIP':
      return TRANSACTION.TRANSACTION_TYPE.BETSLIP;
    case 'PROMOCODE BENEFIT':
      return TRANSACTION.TRANSACTION_TYPE.DEPOSIT_PROMO_CODE_BENEFIT;
    case 'REFERRAL SIGNUP BONUS':
      return TRANSACTION.TRANSACTION_TYPE.REFERRAL_SIGNUP_BONUS;
    case 'WITHOUT REFERRAL SIGNUP BONUS':
      return TRANSACTION.TRANSACTION_TYPE.WITHOUT_REFERRAL_SIGNUP_BONUS;
    case 'ROLLBACK':
      return TRANSACTION.TRANSACTION_TYPE.ROLLBACK;
    default:
      return null;
  }
};

export const loginHistoryResponseMapper = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.UserLoginHistoryID,
      userId: data.UserID,
      ip: data.IPAddress,
      userAgent: data.UserAgent,
      expiredAt: data.ExpiredAt ? getDateInUTCToTimeZone(data.ExpiredAt) : '',
      loginAt: data.DateCreated ? getDateInUTCToTimeZone(data.DateCreated) : ''
    };
  });
};

export const fundTypeOption = [
  {
    value: 'realCash',
    label: 'RealCash',
    color: 'success'
  },
  {
    value: 'winning',
    label: 'Winning',
    color: 'success'
  }
];

export const fundTypeToAPI = (fundType) => {
  switch (fundType) {
    case 'realCash':
      return 0;
    case 'winning':
      return 2;
  }
};

export const playerNotesResponseMapper = (apiData) => {
  return apiData.map((data) => ({
    id: data.CommentID,
    note: data.CommentText,
    adminName: data.Admin.Username,
    isPinned: data.IsPinned ? 'Yes' : 'No',
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
};

export const selfExclusionMapper = (ExclusionType) => {
  //0 - none, 1- 1Day, 2 - 7Days, 3 - 1Month, 4-6month, 5-12month, 6- Custom, 7-Permanent
  switch (ExclusionType) {
    case 0:
      return 'None';
    case 1:
      return '1 Day';
    case 2:
      return '7 Day';
    case 3:
      return '1 Month';
    case 4:
      return '6 Month';
    case 5:
      return '12 Month';
    case 6:
      return 'Custom';
    case 7:
      return 'Permanent';
    default:
      return 'None';
  }
};

export const playerReferralResponseMapper = (apiData) => {
  const totalRecords = apiData.totalRecords;
  const userData = { username: apiData?.data?.referrerData?.Username };
  const list = apiData?.data?.raferralList?.map((item) => {
    return {
      id: item.ReferralID,
      username: item.user.Username,
      mobile: item.user.Mobile,
      email: item.user.Email,
      realCash: item.user.RealCash,
      bonus: item.user.Bonus,
      coin: item.user.Coin,
      createdAt: getDateInUTCToTimeZone(item.DateCreated)
      // transactionData: item.TransactionData,
    };
  });
  return { totalRecords, list, userData };
};
