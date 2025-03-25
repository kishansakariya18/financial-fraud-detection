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
