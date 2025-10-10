import { PAYOUT_STATUS } from 'constants/app.constant';

export const payoutStatusOptions = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' }
];

export const parsePayoutStatusToAPI = (status) => {
  if (status === 'pending') return PAYOUT_STATUS.PENDING;
  if (status === 'approved') return PAYOUT_STATUS.APPROVED;
  if (status === 'rejected') return PAYOUT_STATUS.REJECTED;
  return undefined;
};

export const responseMapper = (apiData) => {
  if (!apiData) return [];
  return apiData.map((data) => ({
    id: data.UserBankDepositUID,
    userID: data.UserID,
    depositBankAccountID: data.DepositBankAccountID,
    currencyCode: data.CurrencyCode,
    amount: data.Amount,
    depositTime: data.DepositTime,
    screenshotURL: data.ScreenshotURL,
    depositStatus: statusToAPP(data.DepositStatus),
    verifiedByAdminID: data.VerifiedByAdminID,
    rejectionReason: data.RejectionReason,
    remarks: data.Remarks,
    bankTransactionID: data.BankTransactionID,
    dateCreated: data.DateCreated,
    dateModified: data.DateModified
  }));
};

export const statusToAPP = (status) => {
  if (status == 0) return 'pending';
  if (status == 1) return 'approved';
  if (status == 2) return 'rejected';
  return 'pending';
};
