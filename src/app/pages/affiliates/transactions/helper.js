import { CheckBadgeIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

// Status mapping
export const referredTxnStatusToApp = (status) => {
  // Accept numeric enums: 0-pending, 1-success, 2-failed
  if (status === 0 || status === '0') return 'pending';
  if (status === 1 || status === '1') return 'success';
  if (status === 2 || status === '2') return 'failed';

  const s = String(status).toUpperCase();
  switch (s) {
    case 'PENDING':
      return 'pending';
    case 'SUCCESS':
    case 'APPROVED':
    case 'COMPLETED':
      return 'success';
    case 'FAILED':
    case 'FAILURE':
      return 'failed';
    default:
      return s.toLowerCase();
  }
};

// Credit/Debit mapping
export const creditDebitToApp = (v) => {
  const s = String(v).toLowerCase();
  return s === 'credit' || s === '0' ? 'credit' : 'debit';
};

// Plan/commission type mapping (REVSHARE/CPA)
export const txnTypeToApp = (v) => {
  const s = String(v).toUpperCase();
  if (s === 'REVSHARE' || s === 'REVENUE_SHARE') return 'revshare';
  if (s === 'CPA') return 'cpa';
  if (s === 'TRANSFER') return 'transfer';
  return s.toLowerCase();
};

export const referredTxnTypeOptions = [
  { value: 'revshare', label: 'Revenue Share' },
  { value: 'cpa', label: 'CPA' },
  { value: 'transfer', label: 'Transfer' }
];

export const referredTxnStatusOptions = [
  { value: 'pending', label: 'Pending', color: 'warning', icon: ClockIcon },
  { value: 'success', label: 'Success', color: 'success', icon: CheckBadgeIcon },
  { value: 'failed', label: 'Failed', color: 'error', icon: XCircleIcon }
];

export const transactionTypeOption = [
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' }
];

// Response mapper based on the provided example response
// Expects shape: { status, message, data: [...], totalRecords, totalPages }
export const referredTxnResponseMapper = (apiData) => {
  const list = (apiData?.data || []).map((item) => {
    return {
      id: item.TransactionID,
      referenceId: item.ReferenceID,
      username: item.Username,
      type: creditDebitToApp(item.CreditDebitType),
      txnType: txnTypeToApp(item.Type),
      amount: item.Amount,
      balanceAfter: item.BalanceAfter,
      currency: {
        id: item.CurrencyID,
        code: item.CurrencyCode,
        name: item.CurrencyName,
        symbol: item.CurrencySymbol
      },
      status: referredTxnStatusToApp(item.TransactionStatus),
      createdAt: item.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : ''
    };
  });

  return {
    list,
    totalRecords: Number(apiData?.totalRecords || 0),
    totalPages: Number(apiData?.totalPages || 0)
  };
};
