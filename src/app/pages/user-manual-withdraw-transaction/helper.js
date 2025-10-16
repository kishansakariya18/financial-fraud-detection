import { PAYOUT_STATUS } from 'constants/app.constant';

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

export const responseMapper = (apiData) => {
  if (!apiData) return [];
  return apiData.map((data) => ({
    id: data.TransactionID,
    userName: data.UserName,
    userID: data.UserID,
    depositBankAccountID: data.DepositBankAccountID,
    currencyCode: data.Currency,
    amount: data.TransactionAmount,
    depositTime: data.DepositTime,
    screenshotURL: data.ScreenshotURL,
    depositStatus: parsePayoutStatusToAPI(data.Status),
    verifiedByAdminID: data.VerifiedByAdminID,
    rejectionReason: data.RejectionReason,
    remarks: data.Remarks,
    bankTransactionID: data.BankTransactionID,
    dateCreated: data.DateCreated,
    dateModified: data.DateModified
  }));
};
