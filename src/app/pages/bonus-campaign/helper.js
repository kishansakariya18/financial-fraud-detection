import {
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from 'helpers/functions';

// Status related helpers
export const parseCampaignStatus = (status) => {
  switch (+status) {
    case 0:
      return 'inactive';
    case 1:
      return 'active';
    case 2:
      return 'expired';
    default:
      return 'inactive';
  }
};

export const parseGrantStatus = (status) => {
  switch (+status) {
    case 0:
      return 'pending';
    case 1:
      return 'active';
    case 2:
      return 'completed';
    case 3:
      return 'expired';
    case 4:
      return 'forfeited';
    case 5:
      return 'cashedOut';
    default:
      return 'pending';
  }
};

export const parseCampaignStatusToApi = (status) => {
  switch (status) {
    case 'inactive':
      return 0;
    case 'active':
      return 1;
    case 'expired':
      return 2;
    default:
      return 0;
  }
};

// Campaign type options
export const campaignTypeOptions = [{ value: 'DEPOSIT_BONUS', label: 'Deposit Bonus' }];

// Claim method options
export const claimMethodOptions = [
  { value: 'AUTO', label: 'Auto' },
  { value: 'MANUAL', label: 'Manual' }
];

// Status options with icons
export const campaignStatusOptions = [
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
    value: 'expired',
    label: 'Expired',
    color: 'warning',
    icon: ClockIcon
  }
];

// Grant status options
export const grantStatusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning',
    icon: ClockIcon
  },
  {
    value: 'active',
    label: 'Active',
    color: 'info',
    icon: BanknotesIcon
  },
  {
    value: 'completed',
    label: 'Completed',
    color: 'success',
    icon: CheckCircleIcon
  },
  {
    value: 'expired',
    label: 'Expired',
    color: 'error',
    icon: ClockIcon
  },
  {
    value: 'forfeited',
    label: 'Forfeited',
    color: 'error',
    icon: XMarkIcon
  },
  {
    value: 'cashedOut',
    label: 'Cashed Out',
    color: 'success',
    icon: CheckBadgeIcon
  }
];

// Wagering requirement type options
export const wageringRequirementOptions = [
  { value: 'BONUS_ONLY', label: 'Bonus Only' },
  { value: 'BONUS_AND_DEPOSIT', label: 'Bonus + Deposit' }
];

// Bonus type options
export const bonusTypeOptions = [
  { value: 0, label: 'Percentage' },
  { value: 1, label: 'Fixed Amount' }
];

// Response mappers
export const bonusCampaignListResponseMapper = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];

  return apiData.map((campaign) => ({
    id: campaign.BonusCampaignID,
    campaignCode: campaign.CampaignCode,
    campaignName: campaign.CampaignName,
    campaignType: campaign.CampaignType,
    status: parseCampaignStatus(campaign.CampaignStatus),
    actualStatus: parseInt(campaign.CampaignStatus),
    startDate: getDateInUTCToTimeZone(campaign.StartDate),
    endDate: getDateInUTCToTimeZone(campaign.EndDate),
    claimMethod: campaign.ClaimMethod,
    maxRedemptionsPerUser: campaign.MaxRedemptionsPerUser,
    totalMaxRedemptions: campaign.TotalMaxRedemptions,
    totalRedemptionsUsed: campaign.TotalRedemptionsUsed,
    bonusType: campaign.BonusType,
    bonusValue: campaign.BonusValue,
    minDepositAmount: campaign.MinDepositAmount,
    maxBonusAmount: campaign.MaxBonusAmount,
    bonusExpiryDays: campaign.BonusExpiryDays,
    wageringRequirementType: campaign.WageringRequirementType,
    wageringMultiplier: campaign.WageringMultiplier,
    cashoutMultiplier: campaign.CashoutMultiplier,
    isKYCRequired: campaign.IsKYCRequired,
    eligibleCurrencies: campaign.EligibleCurrencies || [],
    restrictedCategories: campaign.RestrictedCategories || [],
    description: campaign.Description,
    createdByAdminID: campaign.CreatedByAdminID,
    dateCreated: getDateInUTCToTimeZone(campaign.DateCreated),
    dateUpdated: getDateInUTCToTimeZone(campaign.DateUpdated)
  }));
};

export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value);
};

export const currencyTypeToAPI = (currency) => {
  switch (currency) {
    case 'realCash':
      return 0;
    case 'bonus':
      return 1;
    case 'winning':
      return 2;
    default:
      break;
  }
};
export const discountTypeToAPI = (type) => {
  switch (type) {
    case 'fixed':
      return 0;
    case 'percentage':
      return 1;
    default:
      break;
  }
};
export const displayTypeToAPI = (type) => {
  switch (type) {
    case 'public':
      return 0;
    case 'private':
      return 1;
    default:
      break;
  }
};

export const segmentationTypeToAPI = (type) => {
  switch (type) {
    case 'all':
      return 0;
    case 'specific':
      return 1;
    case 'user-class':
      return 2;
    default:
      break;
  }
};

export const influencerSegTypeToAPP = (value) => {
  switch (value) {
    case 0:
      return 'all';
    case 1:
      return 'specific';
    default:
      return '';
  }
};

export const wageringRequirementTypeToAPP = (value) => {
  switch (value) {
    case 'BONUS_ONLY':
      return 'Bonus Only';
    case 1:
      return 'DEPOSIT_PLUS_BONUS';
    default:
      return 'Deposit + Bonus';
  }
};

export const segmentationTypeToAPP = (value) => {
  switch (+value) {
    case 0:
      return 'all';
    case 1:
      return 'specific';
    default:
      return '';
  }
};

export const displayTypeToAPP = (value) => {
  switch (+value) {
    case 0:
      return 'Yes';
    case 1:
      return 'No';
    default:
      return '';
  }
};

export const discountTypeToAPP = (value) => {
  switch (+value) {
    case 1:
      return 'Percentage';
    case 0:
      return 'Fixed';
    default:
      return '';
  }
};

export const bonusGrantResponseMapper = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return [];

  const resultData = apiData.map((data) => {
    const requiredWR = parseFloat(data.RequiredWR) || 0;
    const completedWR = parseFloat(data.CompletedWR) || 0;
    const wageringProgress = requiredWR > 0 ? (completedWR / requiredWR) * 100 : 0;

    return {
      id: data.BonusGrantID,
      userName: data?.Username || '',
      mobile: data?.Mobile || '',
      txnAmount: parseFloat(data?.TxnAmount) || 0,
      grantBonusAmount: parseFloat(data?.GrantBonusAmount) || 0,
      grantStatus: parseGrantStatus(data.GrantStatus),
      requiredWR: requiredWR,
      completedWR: completedWR,
      wageringProgress: wageringProgress,
      expireOn: data.ExpireOn ? getDateInUTCToTimeZone(data.ExpireOn) : null,
      dateCreated: getDateInUTCToTimeZone(data.DateCreated),
      dateUpdated: getDateInUTCToTimeZone(data.DateUpdated),
      refTxnID: data.RefTxnID,
      refBonusTxnID: data.RefBonusTxnID,
      refBonusCashoutTxnID: data.RefBonusCashoutTxnID,
      grantBonusCurrencyID: data.GrantBonusCurrencyID
    };
  });
  return resultData;
};

export const mapUserClassOptions = (apiData) => {
  let options = [];
  if (apiData.length > 0) {
    options = apiData.map((data) => ({
      value: data.UserClassID,
      label: data.ClassName || 'User Class ' + data.UserClassID
    }));
  }
  return options;
};
