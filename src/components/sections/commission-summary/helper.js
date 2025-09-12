import { getDateInUTCToTimeZone, capitalizeFirstLetter } from 'helpers/functions';
import moment from 'moment-timezone';

// Event name constants
export const EVENT_NAME = {
  DEPOSIT: 'deposit',
  WAGER: 'wager',
  LOSS: 'loss'
};

export const eventNameOptions = [
  { value: EVENT_NAME.DEPOSIT, label: 'Deposit', color: 'primary' },
  { value: EVENT_NAME.WAGER, label: 'Wager', color: 'warning' },
  { value: EVENT_NAME.LOSS, label: 'Loss', color: 'error' }
];

export const commissionSummaryResponseMapper = (apiData) => {
  const totalRecords = apiData.total_records || apiData.totalRecords;
  const list = apiData?.data?.map((item) => {
    return mapSingleSummaryData(item);
  });
  return { totalRecords, list };
};

export const mapSingleSummaryData = (item) => {
  const isPeriodEnded = moment().isAfter(moment(item.PeriodEnd));
  return {
    id: item.CallingAgentCommissionSummaryID,
    targetName: capitalizeFirstLetter(item.TargetName),
    eventName: capitalizeFirstLetter(item.EventName),
    periodStart: item.PeriodStart,
    periodEnd: item.PeriodEnd,
    totalEventAmount: item.TotalEventAmount,
    commissionAmount: item.CommissionAmount,
    calculatedAt: getDateInUTCToTimeZone(item.CalculatedAt),
    isRedeemed: mapRedeemStatus(item.IsRedeemed, item.RedeemRequest, item.CommissionAmount),
    // requestedStatus: mapRequestedStatus(item.RedeemRequestID),
    redeemRequestStatus:
      item.CommissionAmount <= 0 || !isPeriodEnded
        ? null
        : item.RedeemRequest?.Status || 'not_requested',
    redeemRequestDetails: item.RedeemRequest,
    createdAt: getDateInUTCToTimeZone(item.CalculatedAt), // Use CalculatedAt as creation date
    // Store original data for actions
    _originalData: item
  };
};

const mapRedeemStatus = (isRedeemed, redeemRequest, amount) => {
  if (amount <= 0) {
    return null;
  }
  if (isRedeemed === 1) {
    return 'done';
  } else if (redeemRequest) {
    return 'pending'; // Has a redeem request but not yet redeemed
  }
  return null;
};

// const mapRequestedStatus = (redeemRequestID, amount) => {
//   if (amount <= 0) {
//     return null;
//   }
//   if (!redeemRequestID) {
//     return 'not_requested';
//   } else if (redeemRequestID) {
//     return 'requested'; // Has a redeem request but not yet redeemed
//   }
// };

// Simplified redeem filter options (only redeemed or not redeemed)
export const redeemFilterOptions = [
  { value: 'redeemed', label: 'Redeemed', color: 'success' },
  { value: 'not_redeemed', label: 'Not Redeemed', color: 'error' }
];

export const targetNameOptions = [
  { value: 'daily', label: 'Daily', color: 'primary' },
  { value: 'weekly', label: 'Weekly', color: 'primary' },
  { value: 'monthly', label: 'Monthly', color: 'primary' }
];

// Redeem request status options
export const redeemRequestStatusOptions = [
  { value: 'not_requested', label: 'Not Requested', color: 'error' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'primary' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'settled', label: 'Settled', color: 'success' }
];

export const redeemStatusToAPI = (status) => {
  switch (status) {
    case 'redeemed':
      return 1;
    case 'not_redeemed':
      return 0;
    default:
      return null;
  }
};
