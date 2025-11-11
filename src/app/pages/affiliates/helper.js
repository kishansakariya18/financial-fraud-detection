import { ArchiveBoxIcon, CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

const statusToApp = (status) => {
  switch ((status || '').toString().toUpperCase()) {
    case 'ACTIVE':
      return 'ACTIVE';
    case 'CLOSED':
      return 'CLOSED';
    default:
      return 'CLOSED';
  }
};

export const AFFILIATE_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED'
};

export const affiliatesListResponseMapper = (payload) => {
  const data = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  const list = data.map((item) => {
    const user = item?.User || {};
    return {
      id: item?.UserID,
      affiliateUID: item?.AffiliateUID || '-',
      email: user?.Email || '-',
      firstName: user?.FirstName ?? '-',
      lastName: user?.LastName ?? '-',
      username: user?.Username || '-',
      mobile: user?.Mobile || '-',
      status: statusToApp(item?.Status),
      createdAt: item?.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '-',
      refferedUsers: item?.RefferedUsers || '0'
    };
  });
  const totalPages = Array.isArray(payload) ? 0 : payload?.totalPages || 0;
  const totalRecords = Array.isArray(payload)
    ? data.length || 0
    : payload?.totalRecords || data.length || 0;
  return { totalPages, totalRecords, list };
};

// {
//   "TransactionID": 68,
//   "Username": "johndoe",
//   "AffiliateUID": "1REF880534234",
//   "Amount": 6,
//   "CurrencyCode": "USD",
//   "CurrencyName": "DOLLAR",
//   "CurrencySymbol": "$",
//   "TransactionStatus": "APPROVED",
//   "ApprovedMode": "Auto",
//   "DateCreated": "2025-09-19 13:43:54"
// },
export const affiliatesWithdrawalsListResponseMapper = (payload) => {
  const data = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  const list = data.map((item) => {
    return {
      transactionID: item?.TransactionID,
      transactionUID: item?.TransactionUID,
      username: item?.Username,
      affiliateUID: item?.AffiliateUID || '-',
      amount: item?.Amount,
      currencyCode: item?.CurrencyCode,
      currencyName: item?.CurrencyName,
      currencySymbol: item?.CurrencySymbol,
      transactionStatus: transactionStatus(item?.TransactionStatus),
      approvedMode: item?.ApprovedMode,
      createdAt: item?.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '-'
    };
  });
  const totalPages = Array.isArray(payload) ? 0 : payload?.totalPages || 0;
  const totalRecords = Array.isArray(payload)
    ? data.length || 0
    : payload?.totalRecords || data.length || 0;
  return { totalPages, totalRecords, list };
};

const transactionStatus = (status) => {
  switch ((status || '').toString().toUpperCase()) {
    case 'APPROVED':
      return 'approved';
    case 'PENDING':
      return 'pending';
    case 'REJECTED':
      return 'rejected';
    default:
      return 'pending';
  }
};

export const affiliatesWithdrawalsStatusOptions = [
  {
    value: 'approved',
    label: 'Approved',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning',
    icon: XCircleIcon
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: 'error',
    icon: ArchiveBoxIcon
  }
];
