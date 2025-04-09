import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { DOCUMENT_TYPE } from 'constants/app.constant';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import { CiWarning } from 'react-icons/ci';

export const userKYCResponseMapper = (apiData, type) => {
  return apiData.map((data) => {
    if (type === 'bank') {
      return {
        id: data.DocumentID,
        userId: data.user.UserID,
        accountNumber: data.Number,
        name: data.Name,
        type: +data.Type === DOCUMENT_TYPE.DOCUMENT ? 'document' : 'bank',
        bankCode: data.CustomData.BankCode || '',
        bankName: data.CustomData.BankName || '',
        username: data.user.Username || '',
        mobile: data.user.Mobile || '',
        status: parseUserKycStatusToApp(data.Status),
        date: getDateInUTCToTimeZone(data.DateCreated)
      };
    } else {
      return {
        id: data.DocumentID,
        userId: data.user.UserID,
        number: data.Number,
        name: data.Name,
        username: data.user.Username || '',
        mobile: data.user.Mobile || '',
        status: parseUserKycStatusToApp(data.Status),
        date: getDateInUTCToTimeZone(data.DateCreated),
        type: +data.Type === DOCUMENT_TYPE.DOCUMENT ? 'document' : 'bank'
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
  } else {
    res = 'rejected';
  }

  return res;
};
export const parseUserKycStatusToAPI = (status) => {
  let res = 0; //PENDING
  if (status === 'approved') {
    res = 1;
  } else if (status === 'rejected') {
    res = 2;
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
  }
];
export const documentTypeOption = [
  {
    value: 'document',
    label: 'Document'
  },
  {
    value: 'bank',
    label: 'Bank'
  }
];
