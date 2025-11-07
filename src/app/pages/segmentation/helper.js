import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { playerStatusToApp } from 'components/sections/player-management/helper';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export const segmentationResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.UserSegmentID,
    uid: data.UserSegmentUID,
    name: data.Name,
    createdByAdmin: data?.admin?.Username,
    count: data?.Count || '0',
    status: parseSegmentationStatusToAPP(data?.IsActive),
    createdAt: getDateInUTCToTimeZone(data.DateCreated)
  }));
  return resultData;
};

export const playerListResponseMapper = (apiData) => {
  console.log('apiData', apiData);
  const list = apiData.map((item) => {
    return {
      userID: item.UserID,
      userUID: item.UserUID,
      email: item.Email || '-',
      referralCode: item.ReferralCode,
      firstName: item.FirstName,
      lastName: item.LastName,
      username: item.Username,
      mobile: item.Mobile || '-',
      realCash: item.RealCash,
      bonus: item.Bonus,
      winning: item.Winning,
      coin: item.Coin,
      cryptoDeposit: item.CryptoDeposit,
      cryptoWinning: item.CryptoWinning,
      status: playerStatusToApp(item.AccountStatus),
      createdAt: item.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : '-',
      lastLoginAt: item.LastLoginAt ? getDateInUTCToTimeZone(item.LastLoginAt) : '-',
      isBankVerified: item.IsBankVerified ? 'Yes' : 'No'
    };
  });
  const totalPage = apiData.totalPages;
  const totalRecords = apiData.totalRecord;
  return { totalPage, totalRecords, list };
};

export const parseSegmentationStatusToAPP = (status) => {
  switch (+status) {
    case 0:
      return 'inactive';
    case 1:
      return 'active';
  }
};
export const parseSegmentationStatusToAPI = (status) => {
  switch (status) {
    case 'active':
      return 1;
    case 'inactive':
      return 0;
  }
};

export const segmentationStatusOptions = [
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
];

export const kycOptions = [
  { value: 1, label: 'Level 1' },
  { value: 2, label: 'Level 2' },
  { value: 3, label: 'Level 3' },
  { value: 4, label: 'Level 4' }
];

export const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' }
];
export const userclassOptions = [
  {
    key: 'active',
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    key: 'inactive',
    value: 'inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  }
];
