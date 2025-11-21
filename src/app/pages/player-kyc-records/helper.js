import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { DOCUMENT_TYPE } from 'constants/app.constant';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { CiWarning } from 'react-icons/ci';

export const userKYCResponseMapper = (apiData, type) => {
  return apiData.map((data) => {
    if (type === 'bank') {
      return {
        id: data.DocumentID,
        userId: data.user.UserID,
        accountNumber: data.DocumentIdentifier,
        name: data.NameOnDocument,
        type: +data.DocumentType === DOCUMENT_TYPE.DOCUMENT ? 'document' : 'bank',
        bankCode: data.CustomData.BankCode || '',
        bankName: data.CustomData.BankName || '',
        username: data.user.Username || '',
        mobile: data.user.Mobile || '',
        status: parseUserKycStatusToApp(data.DocumentStatus),
        date: getDateInUTCToTimeZone(data.DateCreated),
        provider:
          data.KycProvider === '0' || data.KycProvider === null || data.KycProvider === undefined
            ? 'Manual'
            : capitalizeFirstLetter(data.KycProvider)
      };
    } else {
      return {
        id: data.DocumentID,
        userId: data.user.UserID,
        number: data.DocumentIdentifier,
        name: data.NameOnDocument,
        username: data.user.Username || '',
        mobile: data.user.Mobile || '',
        status: parseUserKycStatusToApp(data.DocumentStatus),
        date: getDateInUTCToTimeZone(data.DateCreated),
        type: String(data.DocumentType),
        provider:
          data.KycProvider === '0' || data.KycProvider === null || data.KycProvider === undefined
            ? 'Manual'
            : capitalizeFirstLetter(data.KycProvider)
      };
    }
  });
};

export const coinPackageTransactionResponseMapper = (apiData) => {
  const res = apiData.map((data) => {
    return {
      id: data.CoinHistoryID,
      mobile: data.user.Mobile,
      username: data.user.Username,
      bnktxnId: data.BankTxnID,
      dateCreated: getDateInUTCToTimeZone(data.DateCreated)
    };
  });
  return { result: res, packageId: apiData[0]?.coin_store?.PackageID };
};

export const parseUserKycStatusToApp = (status) => {
  let res = '';
  if (+status === 1) {
    res = 'approved';
  } else if (+status === 0) {
    res = 'pending';
  } else if (+status === 2) {
    res = 'rejected';
  } else if (+status === 3) {
    res = 'auto approved';
  } else if (+status === 4) {
    res = 'auto rejected';
  } else {
    res = 'pending';
  }
  return res;
};

export const parseUserKycStatusToAPI = (status) => {
  let res = 0; //PENDING
  if (status === 'approved') {
    res = 1;
  } else if (status === 'rejected') {
    res = 2;
  } else if (status === 'auto approved') {
    res = 3;
  } else if (status === 'auto rejected') {
    res = 4;
  }

  return res;
};

export const userKycStatusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning',
    icon: CiWarning
  },
  {
    value: 'approved',
    label: 'Approved',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: 'error',
    icon: XCircleIcon
  },
  {
    value: 'auto approved',
    label: 'Auto Approved',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'auto rejected',
    label: 'Auto Rejected',
    color: 'error',
    icon: XCircleIcon
  }
];

export const documentTypeOption = [
  {
    value: '1',
    label: 'Level 2'
  },
  {
    value: '3',
    label: 'Level 3'
  },
  {
    value: '2',
    label: 'Level 4'
  }
];
