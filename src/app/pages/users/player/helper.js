import { getDateInUTCToTimeZone } from "helpers/functions";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const responseMapper = (apiData) => {
  const list = apiData.map((item) => {
    return {
      id: item.UserID,
      userID: item.UserID,
      userUID: item.UserUID,
      email: item.Email || "-",
      referralCode: item.ReferralCode,
      username: item.Username,
      mobile: item.Mobile || "-",
      realCash: item.RealCash,
      realCashAmount: item.RealCashAmount,
      bonus: item.Bonus,
      winning: item.Winning,
      coin: item.Coin,
      cryptoDeposit: item.CryptoDeposit,
      cryptoWinning: item.CryptoWinning,
        status: playerStatusToApp(item.Status),
      createdAt: item.DateCreated ?  getDateInUTCToTimeZone(item.DateCreated): '',
      lastLoginAt: item.LastLoginAt ?  getDateInUTCToTimeZone(item.LastLoginAt) : '',
      isBankVerified: item.IsBankVerified,
    };
  });

  return list
//   const totalPage = apiData.totalPages;
//   const totalRecords = apiData.totalRecords;
//   return { totalPage, totalRecords, list };
};


export const playerStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'active'
    case 0: 
      return 'inactive'
    default:
      break;
  }
}


export const playerStatusToAPI = (status) => {
  switch (status) {
    case 'active':
      return 1
    case 'inactive':
      return 0
    default:
      return null
  }
}




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
]


export const playerTransactionsResponseMapper = (apiData) => {
  const totalRecords = apiData.totalRecords;
  const userData = { username: apiData?.data?.userData?.Username };
  const list = apiData?.data?.transactionList?.map((item) => {
    return {
      transactionID: item.TransactionID,
      // type: transactionTypeApiToApp(item.Type),
      customMessage: item.CustomMessage,
      realCash: item.RealCash,
      bonus: item.Bonus,
      realCashAmount: item.RealCashAmount,
      // transactionMesg: transactionTypeInWords(item.TransactionType),
      winning:
        parseFloat(item.Winning) > 0
          ? item.Winning
          : item.TransactionData['Merchandise_Product_name']
            ? item.TransactionData['Merchandise_Product_name']
            : 0,
      coin: item.Coin,
      dateCreated: getDateInUTCToTimeZone(item.DateCreated),
      // status: transactionStatusApiToApp(item.Status),
      transactionData: item.TransactionData,
      transactionUID: item.TransactionUID,
      username: item.user.Username,
      admin: item.admin
    };
  });
  return { totalRecords, list, userData };
};
