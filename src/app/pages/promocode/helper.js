import { CheckBadgeIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { PROMOCODE } from 'constants/app.constant';
import { getDateInUTCToTimeZone } from 'helpers/functions';
export const parsePromoCodeStatus = (status) => {
  switch (+status) {
    case 0:
      return 'inactive';
    case 1:
      return 'active';
    case 2:
      return 'deleted';
    default:
      return 'not found';
  }
};
export const parsePromoCodeStateToApp = (status) => {
  switch (+status) {
    case 0:
      return 'available';
    case 1:
      return 'expired';
    default:
      return 'not found';
  }
};

export const promocodeStateOptions = [
  {
    value: 'available',
    label: 'Available'
  },
  {
    value: 'expired',
    label: 'Expired'
  }
];

export const promocodeStatusOptions = [
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
    value: 'deleted',
    label: 'Deleted',
    color: 'error',
    icon: TrashIcon
  }
];

export const parsePromoCodeStatusStatusToApi = (status) => {
  let apiStatus = '';
  if (status === 'inactive') {
    apiStatus = 0;
  } else if (status === 'active') {
    apiStatus = 1;
  } else if (status === 'deleted') {
    apiStatus = 2;
  }
  return apiStatus;
};

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const promocodeListResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.PromoCodeID,
    promoCodeName: data.PromoCode,
    type: data?.DepositRequirementType ? 'Deposit In Range' : 'Exact Deposit',
    discountType: data?.DiscountType ? 'Percentage' : 'Fixed',
    segmentationType: data?.SegmentationType,
    currency: data?.BenefitCurrencyType === 1 ? 'Bonus' : 'Real Cash',
    amount: data.Amount,
    createdAt: getDateInUTCToTimeZone(data.StartDate),
    endDate: getDateInUTCToTimeZone(data.EndDate),
    endDateOriginal: getDateInUTCToTimeZone(data.EndDate),
    visibility: data?.IsPubliclyVisible ? 'Private' : 'Public',
    status: parsePromoCodeStatus(data.PromoCodeStatus),
    state: parsePromoCodeStateToApp(data.PromoCodeState),
    hasUserSegmentation: data.HasUserSegmentation ? 1 : 0,
    // firstDepositOnly: data.FirstDepositOnly ? 'Yes' : 'No',
    secondDepositOnly: data.IsSecondDepositOnly ? 'Yes' : 'No',
    firstDepositOnly: data.IsFirstDepositOnly ? 'Yes' : 'No'
  }));
  return resultData;
};

export const historyResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.PromoCodeHistoryID,
    userName: data?.User?.Username || '',
    mobile: data?.User?.Mobile || '',
    depositAmount: data?.DepositAmount || 0,
    benefitAmount: data?.BenefitAmount || 0,
    usedAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
  return resultData;
};

export const promocodeAffiliatesMapper = (data) => {
  const resultData = data.map((data) => data?.Name);
  return resultData.toString();
};

export const promocodeSegmentationsMapper = (data) => {
  const resultData = data.map((data) => data?.Name);
  return resultData.toString();
};

export const promocodeTypeOptions = [
  { value: PROMOCODE.TYPE.EXACT_DEPOSIT, label: 'Exact Deposit' },
  { value: PROMOCODE.TYPE.DEPOSIT_IN_RANGE, label: 'Deposit In Range' }
];

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

export const influencerSegTypeToAPI = (type) => {
  switch (type) {
    case 'all':
      return 0;
    case 'specific':
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

export const currencyTypeToAPP = (value) => {
  switch (+value) {
    case 0:
      return 'realCash';
    case 1:
      return 'bonus';
    case 2:
      return 'winning';
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

export const typeToAPP = (value) => {
  switch (+value) {
    case PROMOCODE.TYPE.EXACT_DEPOSIT:
      return 'Exact Deposit';
    case PROMOCODE.TYPE.DEPOSIT_IN_RANGE:
      return 'Deposit In Range';
    default:
      return 'Not Define';
  }
};
