import { PAYOUT_STATUS } from 'constants/app.constant';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const payoutStatusOptions = [
  { value: 0, label: 'Pending', color: 'warning' },
  { value: 1, label: 'Approved', color: 'success' },
  { value: 2, label: 'Rejected', color: 'error' }
];
export const withdrawStatusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'APPROVED', label: 'Approved', color: 'success' },
  { value: 'REJECTED', label: 'Rejected', color: 'error' }
];

export const parsePayoutStatusToAPI = (status) => {
  if (status === undefined || status === null) return undefined;
  if (typeof status === 'number') return status; // already 0/1/2
  const str = String(status).trim();
  if (/^\d+$/.test(str)) return Number(str);
  const s = str.toUpperCase();
  if (s === 'PENDING') return PAYOUT_STATUS.PENDING;
  if (s === 'APPROVED') return PAYOUT_STATUS.APPROVED;
  if (s === 'REJECTED') return PAYOUT_STATUS.REJECTED;
  return undefined;
};
export const parsePayoutStatusToApp = (status) => {
  if (+status === PAYOUT_STATUS.PENDING) return 'PENDING';
  if (+status === PAYOUT_STATUS.APPROVED) return 'APPROVED';
  if (+status === PAYOUT_STATUS.REJECTED) return 'REJECTED';
  return undefined;
};

export const responseMapper = (apiData) => {
  if (!apiData) return [];
  return apiData.map((data) => ({
    id: data.TransactionID,
    userName: data.UserName,
    userID: data.UserID,
    depositBankAccountID: data.DepositBankAccountID,
    currencyCode: data.Currency,
    currencyType: data.CurrencyType === '0' ? 'FIAT' : 'CRYPTO',
    withdrawType:
      data.WithdrawType !== null
        ? data.WithdrawType
        : data.CurrencyType === '0'
          ? 'FIAT'
          : 'CRYPTO',
    amount: data.TransactionAmount,
    depositTime: data.DepositTime,
    screenshotURL: data.ScreenshotURL,
    depositStatus: parsePayoutStatusToAPI(data.Status),
    verifiedByAdminID: data.VerifiedByAdminID,
    rejectionReason: data.RejectionReason,
    remarks: data.Remarks,
    network: data.TransactionData?.WithdrawalMethodData?.network,
    walletAddress: data.TransactionData?.WithdrawalMethodData?.walletAddress,
    cardNumber: data.TransactionData?.WithdrawalMethodData?.cardNumber,
    cardExpitry: data.TransactionData?.WithdrawalMethodData?.cardExpiry,
    cardholderName: data.TransactionData?.WithdrawalMethodData?.cardholderName,
    bankTransactionID: data.BankTransactionID,
    dateCreated: getDateInUTCToTimeZone(data.DateCreated),
    dateModified: data.DateModified,
    actualWithdrawAmount: data.TransactionData?.ActualWithdrawAmount,
    withdrawCommissionPercent: data.TransactionData?.WithdrawCommissionPercent,
    withdrawCommissionAmount: data.TransactionData?.WithdrawCommissionAmount
  }));
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return '';
  const last4 = cardNumber.slice(-4);
  if (!last4) return '-';
  return `**** **** **** ${last4}`;
};
