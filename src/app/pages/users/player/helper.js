import { getDateInUTCToTimeZone } from 'helpers/functions';
import { CheckBadgeIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { TRANSACTION } from 'constants/app.constant';

export const responseMapper = (apiData) => {
  const list = apiData.map((item) => {
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
      status: playerStatusToApp(item.Status),
      createdAt: item.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '',
      lastLoginAt: item.LastLoginAt ? getDateInUTCToTimeZone(item.LastLoginAt) : '',
      isBankVerified: item.IsBankVerified
    };
  });

  return list;
  //   const totalPage = apiData.totalPages;
  //   const totalRecords = apiData.totalRecords;
  //   return { totalPage, totalRecords, list };
};

export const playerStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'active';
    case 0:
      return 'inactive';
    default:
      break;
  }
};

export const playerStatusToAPI = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
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
  }
];

export const playerTransactionsResponseMapper = (apiData) => {
  const totalRecords = apiData.totalRecords;
  const userData = { username: apiData?.data?.userData?.Username };
  const list = apiData?.data?.transactionList?.map((item) => {
    return {
      id: item.TransactionID,
      transactionUID: item.TransactionUID,
      username: userData.username,
      type: transactionTypeApiToApp(item.Type),
      customMessage: item.CustomMessage,
      realCash: item.RealCash,
      bonus: item.Bonus,
      realCashAmount: item.RealCashAmount,
      transactionType: transactionTypeInWords(item.TransactionType),
      transactionMesg: transactionTypeInWords(item.TransactionType),
      winning:
        parseFloat(item.Winning) > 0
          ? item.Winning
          : item.TransactionData['Merchandise_Product_name']
            ? item.TransactionData['Merchandise_Product_name']
            : 0,
      coin: item.Coin,
      createdAt: getDateInUTCToTimeZone(item.DateCreated),
      status: transactionStatusToAPP(item.Status),
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

export const transactionTypeInWords = (type) => {
  if (+type === TRANSACTION.TRANSACTION_TYPE.SYSTEM) {
    return 'ADMIN SYSTEM';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.DEPOSIT) {
    return 'DEPOSIT';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.WINNING) {
    return 'WINNING';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.WITHDRAW) {
    return 'WITHDRAW';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.DEPOSIT_TAX) {
    return 'DEPOSIT TAX';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.WITHDRAW_TAX) {
    return 'WITHDRAW TAX';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.BETSLIP) {
    return 'BET SLIP';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.DEPOSIT_PROMO_CODE_BENEFIT) {
    return 'PROMOCODE BENEFIT';
  } else if (+type === TRANSACTION.TRANSACTION_TYPE.ROLLBACK) {
    return 'ROLLBACK';
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
    value: 'PROMOCODE_BENEFIT',
    label: 'Promocode Benefit',
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
    case 'PROMOCODE_BENEFIT':
      return TRANSACTION.TRANSACTION_TYPE.DEPOSIT_PROMO_CODE_BENEFIT;
    case 'ROLLBACK':
      return TRANSACTION.TRANSACTION_TYPE.ROLLBACK;
    default:
      return null;
  }
};

export const loginHistoryResponseMapper = (apiData) => {
  return apiData.map((data) => {
    return {
      id: data.ID,
      userId: data.UserID,
      ip: data.Ip,
      userAgent: data.UserAgent,
      expiredAt: data.ExpiredAt,
      loginAt: data.DateCreated
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
